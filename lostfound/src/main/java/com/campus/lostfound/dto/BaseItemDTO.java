package com.campus.lostfound.dto;

import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;

import java.time.LocalDateTime;

// [OOPS - ABSTRACTION]: Base DTO capturing common HTTP properties
public abstract class BaseItemDTO {

    private Long id;
    private String title;
    private ItemCategory category;
    private String description;
    private String location;
    private ItemStatus status;
    private LocalDateTime createdAt;

    protected BaseItemDTO() {}

    protected BaseItemDTO(Long id, String title, ItemCategory category, String description, 
                          String location, ItemStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.location = location;
        this.status = status;
        this.createdAt = createdAt;
    }

    // [OOPS - POLYMORPHISM]: Dynamic type getter for API responses
    public abstract String getItemType();

    // [OOPS - ENCAPSULATION]: Controlled access via getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}