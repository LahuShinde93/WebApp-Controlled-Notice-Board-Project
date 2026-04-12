package com.noticeboard.controller;

import com.noticeboard.dto.response.ApiResponse;
import com.noticeboard.dto.response.DashboardResponse;
import com.noticeboard.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);
    
    private final DashboardService dashboardService;
    
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    
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
