package com.campus.lostfound.dto;

// [OOPS - ENCAPSULATION]: Clean data transfer object for dashboard metrics
public class DashboardStatsDTO {

    private long totalLost;
    private long totalFound;
    private long totalRecovered;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalLost, long totalFound, long totalRecovered) {
        this.totalLost = totalLost;
        this.totalFound = totalFound;
        this.totalRecovered = totalRecovered;
    }

    public long getTotalLost() {
        return totalLost;
    }

    public void setTotalLost(long totalLost) {
        this.totalLost = totalLost;
    }

    public long getTotalFound() {
        return totalFound;
    }

    public void setTotalFound(long totalFound) {
        this.totalFound = totalFound;
    }

    public long getTotalRecovered() {
        return totalRecovered;
    }

    public void setTotalRecovered(long totalRecovered) {
        this.totalRecovered = totalRecovered;
    }
}