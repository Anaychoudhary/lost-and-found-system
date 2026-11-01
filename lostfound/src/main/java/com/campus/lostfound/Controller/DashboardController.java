package com.campus.lostfound.Controller;

import com.campus.lostfound.dto.DashboardStatsDTO;
import com.campus.lostfound.entity.ItemStatus;
import com.campus.lostfound.repository.FoundItemRepository;
import com.campus.lostfound.repository.LostItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class DashboardController {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;

    public DashboardController(LostItemRepository lostItemRepository,
                               FoundItemRepository foundItemRepository) {
        this.lostItemRepository = lostItemRepository;
        this.foundItemRepository = foundItemRepository;
    }

    // READ: Fetch system metrics summary
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        long totalLost = lostItemRepository.count();
        long totalFound = foundItemRepository.count();

        long recoveredLost = lostItemRepository.findByStatus(ItemStatus.RECOVERED).size();
        long recoveredFound = foundItemRepository.findByStatus(ItemStatus.RECOVERED).size();
        long totalRecovered = recoveredLost + recoveredFound;

        DashboardStatsDTO stats = new DashboardStatsDTO(totalLost, totalFound, totalRecovered);
        return ResponseEntity.ok(stats);
    }
}