package com.campus.lostfound.Service.impl;

import com.campus.lostfound.dto.LostItemDTO;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.LostItem;
import com.campus.lostfound.repository.LostItemRepository;
import com.campus.lostfound.Service.LostItemService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostItemServiceImpl implements LostItemService {

    private final LostItemRepository lostItemRepository;

    public LostItemServiceImpl(LostItemRepository lostItemRepository) {
        this.lostItemRepository = lostItemRepository;
    }

    @Override
    public LostItemDTO createReport(LostItemDTO dto) {
        LostItem item = mapToEntity(dto);
        LostItem savedItem = lostItemRepository.save(item);
        return mapToDTO(savedItem);
    }

    @Override
    public LostItemDTO getReportById(Long id) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lost item report not found with id: " + id));
        return mapToDTO(item);
    }

    @Override
    public List<LostItemDTO> getAllReports() {
        return lostItemRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<LostItemDTO> getReportsByStatus(ItemStatus status) {
        return lostItemRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<LostItemDTO> getReportsByCategory(ItemCategory category) {
        return lostItemRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<LostItemDTO> searchByKeyword(String keyword) {
        return searchByFilters(keyword, null, null);
    }

    @Override
    public List<LostItemDTO> searchByFilters(String keyword, ItemCategory category, ItemStatus status) {
        List<LostItem> items;
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        if (normalizedKeyword.isEmpty() && category != null && status != null) {
            items = lostItemRepository.findByCategoryAndStatus(category, status);
        } else if (normalizedKeyword.isEmpty() && category != null) {
            items = lostItemRepository.findByCategory(category);
        } else if (normalizedKeyword.isEmpty() && status != null) {
            items = lostItemRepository.findByStatus(status);
        } else if (normalizedKeyword.isEmpty()) {
            items = lostItemRepository.findAll();
        } else if (category != null && status != null) {
            items = lostItemRepository.findByTitleContainingIgnoreCaseAndCategoryAndStatus(
                    normalizedKeyword, category, status);
        } else if (category != null) {
            items = lostItemRepository.findByTitleContainingIgnoreCaseAndCategory(normalizedKeyword, category);
        } else if (status != null) {
            items = lostItemRepository.findByTitleContainingIgnoreCaseAndStatus(normalizedKeyword, status);
        } else {
            items = lostItemRepository.findByTitleContainingIgnoreCase(normalizedKeyword);
        }
        return items
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public LostItemDTO updateStatus(Long id, ItemStatus newStatus) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lost item report not found with id: " + id));
        item.setStatus(newStatus);
        return mapToDTO(lostItemRepository.save(item));
    }

    @Override
    public void deleteReport(Long id) {
        if (!lostItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Lost item report not found with id: " + id);
        }
        lostItemRepository.deleteById(id);
    }

    private LostItem mapToEntity(LostItemDTO dto) {
        LostItem item = new LostItem();
        item.setTitle(dto.getTitle());
        item.setCategory(dto.getCategory());
        item.setDescription(dto.getDescription());
        item.setLocation(dto.getLocation());
        item.setDateLost(dto.getDateLost());
        item.setReporterContact(dto.getReporterContact());
        item.setRewardOffered(dto.getRewardOffered());
        if (dto.getStatus() != null) {
            item.setStatus(dto.getStatus());
        }
        return item;
    }

    private LostItemDTO mapToDTO(LostItem item) {
        return new LostItemDTO(
                item.getId(),
                item.getTitle(),
                item.getCategory(),
                item.getDescription(),
                item.getLocation(),
                item.getStatus(),
                item.getCreatedAt(),
                item.getDateLost(),
                item.getReporterContact(),
                item.getRewardOffered()
        );
    }
}
