package com.campus.lostfound.Service;

import com.campus.lostfound.dto.LostItemDTO;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;

import java.util.List;

public interface LostItemService extends BaseItemService<LostItemDTO> {
    List<LostItemDTO> searchByKeyword(String keyword);

    List<LostItemDTO> searchByFilters(String keyword, ItemCategory category, ItemStatus status);
}
