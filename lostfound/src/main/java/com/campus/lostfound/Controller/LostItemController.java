package com.campus.lostfound.Controller;

import com.campus.lostfound.dto.LostItemDTO;
import com.campus.lostfound.entity.ItemCategory;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.Service.LostItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lost-items")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class LostItemController {

    // [OOPS - ABSTRACTION & LOOSE COUPLING]: Programmed to the interface, not concrete class
    private final LostItemService lostItemService;

    public LostItemController(LostItemService lostItemService) {
        this.lostItemService = lostItemService;
    }

    // CREATE: Submit new lost item report
    @PostMapping
    public ResponseEntity<LostItemDTO> createReport(@RequestBody LostItemDTO dto) {
        LostItemDTO createdReport = lostItemService.createReport(dto);
        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
    }

    // READ: Retrieve all reports or filter by keyword/status/category
    @GetMapping
    public ResponseEntity<List<LostItemDTO>> getAllReports(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) ItemCategory category) {

        return ResponseEntity.ok(lostItemService.searchByFilters(keyword, category, status));
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<LostItemDTO> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(lostItemService.getReportById(id));
    }

    // UPDATE: Update item status (e.g., REPORTED -> RECOVERED)
    @PutMapping("/{id}/status")
    public ResponseEntity<LostItemDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ItemStatus status) {
        return ResponseEntity.ok(lostItemService.updateStatus(id, status));
    }

    // DELETE: Remove record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        lostItemService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}