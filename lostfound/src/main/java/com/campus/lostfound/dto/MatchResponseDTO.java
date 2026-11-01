package com.campus.lostfound.dto;

import java.util.List;

// [OOPS - ENCAPSULATION]: Holds paired Lost and Found items with calculated confidence metric
public class MatchResponseDTO {

    private LostItemDTO lostItem;
    private FoundItemDTO foundItem;
    private int matchConfidenceScore; // Percentage 0 - 100
    private List<String> matchReasons;

    public MatchResponseDTO() {}

    public MatchResponseDTO(LostItemDTO lostItem, FoundItemDTO foundItem, 
                            int matchConfidenceScore, List<String> matchReasons) {
        this.lostItem = lostItem;
        this.foundItem = foundItem;
        this.matchConfidenceScore = matchConfidenceScore;
        this.matchReasons = matchReasons;
    }

    public LostItemDTO getLostItem() {
        return lostItem;
    }

    public void setLostItem(LostItemDTO lostItem) {
        this.lostItem = lostItem;
    }

    public FoundItemDTO getFoundItem() {
        return foundItem;
    }

    public void setFoundItem(FoundItemDTO foundItem) {
        this.foundItem = foundItem;
    }

    public int getMatchConfidenceScore() {
        return matchConfidenceScore;
    }

    public void setMatchConfidenceScore(int matchConfidenceScore) {
        this.matchConfidenceScore = matchConfidenceScore;
    }

    public List<String> getMatchReasons() {
        return matchReasons;
    }

    public void setMatchReasons(List<String> matchReasons) {
        this.matchReasons = matchReasons;
    }
}