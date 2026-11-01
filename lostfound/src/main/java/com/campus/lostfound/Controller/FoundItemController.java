package com.campus.lostfound.Controller;

import com.campus.lostfound.dto.FoundItemDTO;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.Service.FoundItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/found-items")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class FoundItemController {

    // [OOPS - ABSTRACTION & LOOSE COUPLING]: Injected interface reference
    private final FoundItemService foundItemService;

    public FoundItemController(FoundItemService foundItemService) {
        this.foundItemService = foundItemService;
    }

    // CREATE: Submit new found item report
    @PostMapping
    public ResponseEntity<FoundItemDTO> createReport(@RequestBody FoundItemDTO dto) {
        FoundItemDTO createdReport = foundItemService.createReport(dto);
        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
    }

    // READ: Retrieve all reports or filter by parameters
    @GetMapping
    public ResponseEntity<List<FoundItemDTO>> getAllReports(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) ItemCategory category) {

        return ResponseEntity.ok(foundItemService.searchByFilters(keyword, category, status));
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<FoundItemDTO> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(foundItemService.getReportById(id));
    }

    // UPDATE: Update item status
    @PutMapping("/{id}/status")
    public ResponseEntity<FoundItemDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ItemStatus status) {
        return ResponseEntity.ok(foundItemService.updateStatus(id, status));
    }

    // DELETE: Remove record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        foundItemService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}