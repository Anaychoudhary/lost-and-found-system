package com.campus.lostfound.Service;

import com.campus.lostfound.dto.FoundItemDTO;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;

import java.util.List;

public interface FoundItemService extends BaseItemService<FoundItemDTO> {
    List<FoundItemDTO> searchByKeyword(String keyword);

    List<FoundItemDTO> searchByFilters(String keyword, ItemCategory category, ItemStatus status);
}
