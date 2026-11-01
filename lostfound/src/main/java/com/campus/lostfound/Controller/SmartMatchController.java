package com.campus.lostfound.Controller;

import com.campus.lostfound.dto.MatchResponseDTO;
import com.campus.lostfound.Service.SmartMatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class SmartMatchController {

    private final SmartMatchService smartMatchService;

    public SmartMatchController(SmartMatchService smartMatchService) {
        this.smartMatchService = smartMatchService;
    }

    // READ: Get all high-confidence suggested matches across campus
    @GetMapping
    public ResponseEntity<List<MatchResponseDTO>> getAllMatches() {
        return ResponseEntity.ok(smartMatchService.findAllMatches());
    }

    // READ: Get suggested matches for a specific lost item report ID
    @GetMapping("/lost/{lostItemId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesForLostItem(@PathVariable Long lostItemId) {
        return ResponseEntity.ok(smartMatchService.findMatchesForLostItem(lostItemId));
    }
}