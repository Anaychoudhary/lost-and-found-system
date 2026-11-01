package com.campus.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.ZoneId;

@Entity
@Table(name = "found_items")
public class FoundItem extends Item {

    @Column(name = "date_found", nullable = false)
    private LocalDate dateFound;

    @Column(name = "finder_contact", nullable = false)
    private String finderContact;

    @Column(name = "storage_location", nullable = false)
    private String storageLocation;

    public FoundItem() {
        super();
    }

    public FoundItem(String title, ItemCategory category, String description, 
                     String location, LocalDate dateFound, String finderContact, String storageLocation) {
        super(title, category, description, location);
        this.dateFound = dateFound;
        this.finderContact = finderContact;
        this.storageLocation = storageLocation;
    }

    // Method Overriding (Polymorphism)
    @Override
    public String getItemType() {
        return "FOUND";
    }

    @Override
    public String getContactInformation() {
        return this.finderContact;
    }

    // Getters and Setters
    public LocalDate getDateFound() {
        return dateFound;
    }

    public void setDateFound(LocalDate dateFound) {
        if (dateFound != null && dateFound.isAfter(LocalDate.now(ZoneId.systemDefault()))) {
            throw new IllegalArgumentException("Date found cannot be in the future");
        }
        this.dateFound = dateFound;
    }

    public String getFinderContact() {
        return finderContact;
    }

    public void setFinderContact(String finderContact) {
        this.finderContact = finderContact;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }
}