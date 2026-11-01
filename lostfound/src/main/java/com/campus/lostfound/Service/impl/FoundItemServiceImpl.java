package com.campus.lostfound.Service.impl;

import com.campus.lostfound.dto.FoundItemDTO;
import com.campus.lostfound.entity.FoundItem;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.repository.FoundItemRepository;
import com.campus.lostfound.Service.FoundItemService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoundItemServiceImpl implements FoundItemService {

    private final FoundItemRepository foundItemRepository;

    public FoundItemServiceImpl(FoundItemRepository foundItemRepository) {
        this.foundItemRepository = foundItemRepository;
    }

    @Override
    public FoundItemDTO createReport(FoundItemDTO dto) {
        FoundItem item = mapToEntity(dto);
        FoundItem savedItem = foundItemRepository.save(item);
        return mapToDTO(savedItem);
    }

    @Override
    public FoundItemDTO getReportById(Long id) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Found item report not found with id: " + id));
        return mapToDTO(item);
    }

    @Override
    public List<FoundItemDTO> getAllReports() {
        return foundItemRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<FoundItemDTO> getReportsByStatus(ItemStatus status) {
        return foundItemRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<FoundItemDTO> getReportsByCategory(ItemCategory category) {
        return foundItemRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<FoundItemDTO> searchByKeyword(String keyword) {
        return searchByFilters(keyword, null, null);
    }

    @Override
    public List<FoundItemDTO> searchByFilters(String keyword, ItemCategory category, ItemStatus status) {
        List<FoundItem> items;
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        if (normalizedKeyword.isEmpty() && category != null && status != null) {
            items = foundItemRepository.findByCategoryAndStatus(category, status);
        } else if (normalizedKeyword.isEmpty() && category != null) {
            items = foundItemRepository.findByCategory(category);
        } else if (normalizedKeyword.isEmpty() && status != null) {
            items = foundItemRepository.findByStatus(status);
        } else if (normalizedKeyword.isEmpty()) {
            items = foundItemRepository.findAll();
        } else if (category != null && status != null) {
            items = foundItemRepository.findByTitleContainingIgnoreCaseAndCategoryAndStatus(
                    normalizedKeyword, category, status);
        } else if (category != null) {
            items = foundItemRepository.findByTitleContainingIgnoreCaseAndCategory(normalizedKeyword, category);
        } else if (status != null) {
            items = foundItemRepository.findByTitleContainingIgnoreCaseAndStatus(normalizedKeyword, status);
        } else {
            items = foundItemRepository.findByTitleContainingIgnoreCase(normalizedKeyword);
        }
        return items
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public FoundItemDTO updateStatus(Long id, ItemStatus newStatus) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Found item report not found with id: " + id));
        item.setStatus(newStatus);
        return mapToDTO(foundItemRepository.save(item));
    }

    @Override
    public void deleteReport(Long id) {
        if (!foundItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Found item report not found with id: " + id);
        }
        foundItemRepository.deleteById(id);
    }

    private FoundItem mapToEntity(FoundItemDTO dto) {
        FoundItem item = new FoundItem();
        item.setTitle(dto.getTitle());
        item.setCategory(dto.getCategory());
        item.setDescription(dto.getDescription());
        item.setLocation(dto.getLocation());
        item.setDateFound(dto.getDateFound());
        item.setFinderContact(dto.getFinderContact());
        item.setStorageLocation(dto.getStorageLocation());
        if (dto.getStatus() != null) {
            item.setStatus(dto.getStatus());
        }
        return item;
    }

    private FoundItemDTO mapToDTO(FoundItem item) {
        return new FoundItemDTO(
                item.getId(),
                item.getTitle(),
                item.getCategory(),
                item.getDescription(),
                item.getLocation(),
                item.getStatus(),
                item.getCreatedAt(),
                item.getDateFound(),
                item.getFinderContact(),
                item.getStorageLocation()
        );
    }
}
