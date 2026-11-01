package com.campus.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.ZoneId;

@Entity
@Table(name = "lost_items")
public class LostItem extends Item {

    @Column(name = "date_lost", nullable = false)
    private LocalDate dateLost;

    @Column(name = "reporter_contact", nullable = false)
    private String reporterContact;

    @Column(name = "reward_offered")
    private Double rewardOffered;

    public LostItem() {
        super();
    }

    public LostItem(String title, ItemCategory category, String description, 
                    String location, LocalDate dateLost, String reporterContact, Double rewardOffered) {
        super(title, category, description, location);
        this.dateLost = dateLost;
        this.reporterContact = reporterContact;
        this.rewardOffered = rewardOffered;
    }

    // Method Overriding (Polymorphism)
    @Override
    public String getItemType() {
        return "LOST";
    }

    @Override
    public String getContactInformation() {
        return this.reporterContact;
    }

    // Getters and Setters
    public LocalDate getDateLost() {
        return dateLost;
    }

    public void setDateLost(LocalDate dateLost) {
        if (dateLost != null && dateLost.isAfter(LocalDate.now(ZoneId.systemDefault()))) {
            throw new IllegalArgumentException("Date lost cannot be in the future");
        }
        this.dateLost = dateLost;
    }

    public String getReporterContact() {
        return reporterContact;
    }

    public void setReporterContact(String reporterContact) {
        this.reporterContact = reporterContact;
    }

    public Double getRewardOffered() {
        return rewardOffered;
    }

    public void setRewardOffered(Double rewardOffered) {
        this.rewardOffered = rewardOffered;
    }
}