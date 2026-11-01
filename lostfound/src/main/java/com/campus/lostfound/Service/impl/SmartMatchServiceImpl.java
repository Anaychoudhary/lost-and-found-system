package com.campus.lostfound.Service.impl;

import com.campus.lostfound.dto.FoundItemDTO;
import com.campus.lostfound.dto.LostItemDTO;
import com.campus.lostfound.dto.MatchResponseDTO;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.Service.FoundItemService;
import com.campus.lostfound.Service.LostItemService;
import com.campus.lostfound.Service.SmartMatchService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class SmartMatchServiceImpl implements SmartMatchService {

    private final LostItemService lostItemService;
    private final FoundItemService foundItemService;

    public SmartMatchServiceImpl(LostItemService lostItemService, FoundItemService foundItemService) {
        this.lostItemService = lostItemService;
        this.foundItemService = foundItemService;
    }

    @Override
    public List<MatchResponseDTO> findAllMatches() {
        // Fetch active (REPORTED) lost and found items
        List<LostItemDTO> activeLostItems = lostItemService.getReportsByStatus(ItemStatus.REPORTED);
        List<FoundItemDTO> activeFoundItems = foundItemService.getReportsByStatus(ItemStatus.REPORTED);

        List<MatchResponseDTO> matches = new ArrayList<>();

        for (LostItemDTO lost : activeLostItems) {
            for (FoundItemDTO found : activeFoundItems) {
                MatchResponseDTO match = evaluatePair(lost, found);
                if (match.getMatchConfidenceScore() >= 50) { // Threshold for suggested match
                    matches.add(match);
                }
            }
        }

        // Sort results highest confidence first
        matches.sort((m1, m2) -> Integer.compare(m2.getMatchConfidenceScore(), m1.getMatchConfidenceScore()));
        return matches;
    }

    @Override
    public List<MatchResponseDTO> findMatchesForLostItem(Long lostItemId) {
        LostItemDTO lost = lostItemService.getReportById(lostItemId);
        List<FoundItemDTO> activeFoundItems = foundItemService.getReportsByStatus(ItemStatus.REPORTED);

        return activeFoundItems.stream()
                .map(found -> evaluatePair(lost, found))
                .filter(match -> match.getMatchConfidenceScore() >= 50)
                .sorted((m1, m2) -> Integer.compare(m2.getMatchConfidenceScore(), m1.getMatchConfidenceScore()))
                .toList();
    }

    // [OOPS - ENCAPSULATION & ALGORITHMIC RULES]: Internal matching algorithm
    private MatchResponseDTO evaluatePair(LostItemDTO lost, FoundItemDTO found) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        // Rule 1: Category Match (Weight: 40 points)
        if (lost.getCategory() == found.getCategory()) {
            score += 40;
            reasons.add("Exact category match: " + lost.getCategory());
        }

        // Rule 2: Location Match (Weight: 30 points)
        if (isLocationMatch(lost.getLocation(), found.getLocation())) {
            score += 30;
            reasons.add("Campus location match: " + lost.getLocation());
        }

        // Rule 3: Title & Description Keyword Similarity (Weight: up to 30 points)
        int keywordScore = calculateKeywordSimilarity(
                lost.getTitle() + " " + lost.getDescription(),
                found.getTitle() + " " + found.getDescription()
        );
        if (keywordScore > 0) {
            score += keywordScore;
            reasons.add("Keyword overlap similarity score: +" + keywordScore + "%");
        }

        return new MatchResponseDTO(lost, found, Math.min(score, 100), reasons);
    }

    private boolean isLocationMatch(String loc1, String loc2) {
        if (loc1 == null || loc2 == null) return false;
        String l1 = loc1.trim().toLowerCase(Locale.ROOT);
        String l2 = loc2.trim().toLowerCase(Locale.ROOT);
        return l1.equals(l2) || l1.contains(l2) || l2.contains(l1);
    }

    private int calculateKeywordSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0;

        Set<String> words1 = extractTokens(text1);
        Set<String> words2 = extractTokens(text2);

        if (words1.isEmpty() || words2.isEmpty()) return 0;

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        if (intersection.isEmpty()) return 0;

        double jaccardIndex = (double) intersection.size() / (words1.size() + words2.size() - intersection.size());
        return (int) Math.round(jaccardIndex * 30);
    }

    private Set<String> extractTokens(String text) {
        return Arrays.stream(text.toLowerCase(Locale.ROOT).replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+"))
                .filter(w -> w.length() > 2) // Ignore trivial stop words like "a", "in", "it"
                .collect(Collectors.toSet());
    }
}
