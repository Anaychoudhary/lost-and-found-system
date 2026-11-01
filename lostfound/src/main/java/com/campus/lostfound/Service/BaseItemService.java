package com.campus.lostfound.Service;

import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;

import java.util.List;

// [OOPS - ABSTRACTION & GENERICS]: Generic contract defining item management behaviors
public interface BaseItemService<T> {

    T createReport(T dto);

    T getReportById(Long id);

    List<T> getAllReports();

    List<T> getReportsByStatus(ItemStatus status);

    List<T> getReportsByCategory(ItemCategory category);

    T updateStatus(Long id, ItemStatus newStatus);

    void deleteReport(Long id);
}
