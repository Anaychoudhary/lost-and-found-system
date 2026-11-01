package com.campus.lostfound.repository;

import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    List<LostItem> findByStatus(ItemStatus status);

    List<LostItem> findByCategory(ItemCategory category);

    List<LostItem> findByTitleContainingIgnoreCase(String keyword);

    List<LostItem> findByTitleContainingIgnoreCaseAndCategory(String keyword, ItemCategory category);

    List<LostItem> findByTitleContainingIgnoreCaseAndStatus(String keyword, ItemStatus status);

    List<LostItem> findByTitleContainingIgnoreCaseAndCategoryAndStatus(
            String keyword, ItemCategory category, ItemStatus status);

    List<LostItem> findByCategoryAndStatus(ItemCategory category, ItemStatus status);
}
