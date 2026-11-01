package com.campus.lostfound.dto;

import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

// [OOPS - INHERITANCE]: LostItemDTO extends BaseItemDTO
public class LostItemDTO extends BaseItemDTO {

    private LocalDate dateLost;
    private String reporterContact;
    private Double rewardOffered;

    public LostItemDTO() {
        super();
    }

    public LostItemDTO(Long id, String title, ItemCategory category, String description, 
                       String location, ItemStatus status, LocalDateTime createdAt,
                       LocalDate dateLost, String reporterContact, Double rewardOffered) {
        super(id, title, category, description, location, status, createdAt);
        this.dateLost = dateLost;
        this.reporterContact = reporterContact;
        this.rewardOffered = rewardOffered;
    }

    @Override
    public String getItemType() {
        return "LOST";
    }

    public LocalDate getDateLost() { return dateLost; }
    public void setDateLost(LocalDate dateLost) { this.dateLost = dateLost; }

    public String getReporterContact() { return reporterContact; }
    public void setReporterContact(String reporterContact) { this.reporterContact = reporterContact; }

    public Double getRewardOffered() { return rewardOffered; }
    public void setRewardOffered(Double rewardOffered) { this.rewardOffered = rewardOffered; }
}