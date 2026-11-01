package com.campus.lostfound.dto;

import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

// [OOPS - INHERITANCE]: FoundItemDTO extends BaseItemDTO
public class FoundItemDTO extends BaseItemDTO {

    private LocalDate dateFound;
    private String finderContact;
    private String storageLocation;

    public FoundItemDTO() {
        super();
    }

    public FoundItemDTO(Long id, String title, ItemCategory category, String description, 
                       String location, ItemStatus status, LocalDateTime createdAt,
                       LocalDate dateFound, String finderContact, String storageLocation) {
        super(id, title, category, description, location, status, createdAt);
        this.dateFound = dateFound;
        this.finderContact = finderContact;
        this.storageLocation = storageLocation;
    }

    @Override
    public String getItemType() {
        return "FOUND";
    }

    public LocalDate getDateFound() { return dateFound; }
    public void setDateFound(LocalDate dateFound) { this.dateFound = dateFound; }

    public String getFinderContact() { return finderContact; }
    public void setFinderContact(String finderContact) { this.finderContact = finderContact; }

    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
}