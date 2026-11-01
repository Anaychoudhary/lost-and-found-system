package com.campus.lostfound.repository;

import com.campus.lostfound.entity.FoundItem;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {

    List<FoundItem> findByStatus(ItemStatus status);

    List<FoundItem> findByCategory(ItemCategory category);

    List<FoundItem> findByTitleContainingIgnoreCase(String keyword);

    List<FoundItem> findByTitleContainingIgnoreCaseAndCategory(String keyword, ItemCategory category);

    List<FoundItem> findByTitleContainingIgnoreCaseAndStatus(String keyword, ItemStatus status);

    List<FoundItem> findByTitleContainingIgnoreCaseAndCategoryAndStatus(
            String keyword, ItemCategory category, ItemStatus status);

    List<FoundItem> findByCategoryAndStatus(ItemCategory category, ItemStatus status);
}
