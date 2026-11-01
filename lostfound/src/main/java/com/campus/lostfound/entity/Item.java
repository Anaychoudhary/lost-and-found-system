package com.campus.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@MappedSuperclass
public abstract class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Default Constructor (Required by JPA)
    protected Item() {
        this.status = ItemStatus.REPORTED;
        this.createdAt = LocalDateTime.now(ZoneId.systemDefault());
    }

    // Parameterized Constructor
    protected Item(String title, ItemCategory category, String description, String location) {
        this();
        this.title = title;
        this.category = category;
        this.description = description;
        this.location = location;
    }

    // Abstract method defining polymorphic behavior
    public abstract String getItemType();

    // Abstract method to extract reporter/finder contact
    public abstract String getContactInformation();

    // Encapsulation: Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Item title cannot be empty");
        }
        this.title = title;
    }

    public ItemCategory getCategory() {
        return category;
    }

    public void setCategory(ItemCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}