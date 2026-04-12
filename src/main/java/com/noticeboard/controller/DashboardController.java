package com.noticeboard.controller;

import com.noticeboard.dto.response.ApiResponse;
import com.noticeboard.dto.response.DashboardResponse;
import com.noticeboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    /**
     * Get dashboard statistics
     * GET /api/dashboard/stats
     * Response: { "status": "SUCCESS", "message": "Dashboard stats retrieved successfully", 
     *            "data": { "totalNotices": 10, "activeNotices": 7, "expiredNotices": 3, "totalCategories": 5 } }
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardStats() {
        log.info("GET /api/dashboard/stats - Fetching dashboard statistics");
        DashboardResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
    }
}
