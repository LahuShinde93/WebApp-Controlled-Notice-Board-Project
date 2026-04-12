package com.noticeboard.controller;

import com.noticeboard.dto.request.NoticeRequest;
import com.noticeboard.dto.response.ApiResponse;
import com.noticeboard.model.Notice;
import com.noticeboard.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class NoticeController {
    
    private final NoticeService noticeService;
    
    /**
     * Create a new notice
     * POST /api/notices
     * Headers: Authorization: Bearer <token>
     * Request Body: { "title": "...", "description": "...", "category": "...", "priority": "HIGH", "status": "ACTIVE", "expiryDate": "2026-05-01" }
     * Response: { "status": "SUCCESS", "message": "Notice created successfully", "data": {...} }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Notice>> createNotice(@Valid @RequestBody NoticeRequest request) {
        log.info("POST /api/notices - Creating notice: {}", request.getTitle());
        Notice notice = noticeService.createNotice(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notice created successfully", notice));
    }
    
    /**
     * Update an existing notice
     * PUT /api/notices/{id}
     * Headers: Authorization: Bearer <token>
     * Request Body: { "title": "...", "description": "...", "category": "...", "priority": "MEDIUM", "status": "ACTIVE", "expiryDate": "2026-05-01" }
     * Response: { "status": "SUCCESS", "message": "Notice updated successfully", "data": {...} }
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Notice>> updateNotice(
            @PathVariable String id,
            @Valid @RequestBody NoticeRequest request) {
        log.info("PUT /api/notices/{} - Updating notice", id);
        Notice notice = noticeService.updateNotice(id, request);
        return ResponseEntity.ok(ApiResponse.success("Notice updated successfully", notice));
    }
    
    /**
     * Delete a notice
     * DELETE /api/notices/{id}
     * Headers: Authorization: Bearer <token>
     * Response: { "status": "SUCCESS", "message": "Notice deleted successfully", "data": null }
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(@PathVariable String id) {
        log.info("DELETE /api/notices/{} - Deleting notice", id);
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.success("Notice deleted successfully", null));
    }
    
    /**
     * Get notice by ID
     * GET /api/notices/{id}
     * Response: { "status": "SUCCESS", "message": "Notice retrieved successfully", "data": {...} }
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Notice>> getNoticeById(@PathVariable String id) {
        log.info("GET /api/notices/{} - Fetching notice", id);
        Notice notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(ApiResponse.success("Notice retrieved successfully", notice));
    }
    
    /**
     * Get all notices (sorted by latest first)
     * GET /api/notices
     * Response: { "status": "SUCCESS", "message": "Notices retrieved successfully", "data": [...] }
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notice>>> getAllNotices() {
        log.info("GET /api/notices - Fetching all notices");
        List<Notice> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(ApiResponse.success("Notices retrieved successfully", notices));
    }
    
    /**
     * Get active notices only
     * GET /api/notices/active
     * Response: { "status": "SUCCESS", "message": "Active notices retrieved successfully", "data": [...] }
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Notice>>> getActiveNotices() {
        log.info("GET /api/notices/active - Fetching active notices");
        List<Notice> notices = noticeService.getActiveNotices();
        return ResponseEntity.ok(ApiResponse.success("Active notices retrieved successfully", notices));
    }
    
    /**
     * Get notices by status
     * GET /api/notices/status/{status}
     * Response: { "status": "SUCCESS", "message": "Notices retrieved successfully", "data": [...] }
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Notice>>> getNoticesByStatus(@PathVariable String status) {
        log.info("GET /api/notices/status/{} - Fetching notices by status", status);
        List<Notice> notices = noticeService.getNoticesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Notices retrieved successfully", notices));
    }
    
    /**
     * Get notices by category
     * GET /api/notices/category/{category}
     * Response: { "status": "SUCCESS", "message": "Notices retrieved successfully", "data": [...] }
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Notice>>> getNoticesByCategory(@PathVariable String category) {
        log.info("GET /api/notices/category/{} - Fetching notices by category", category);
        List<Notice> notices = noticeService.getNoticesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Notices retrieved successfully", notices));
    }
}
