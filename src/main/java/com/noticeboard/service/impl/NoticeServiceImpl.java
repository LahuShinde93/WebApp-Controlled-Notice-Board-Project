package com.noticeboard.service.impl;

import com.noticeboard.dao.CategoryDao;
import com.noticeboard.dao.NoticeDao;
import com.noticeboard.dto.request.NoticeRequest;
import com.noticeboard.exception.ResourceNotFoundException;
import com.noticeboard.model.Category;
import com.noticeboard.model.Notice;
import com.noticeboard.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeServiceImpl implements NoticeService {
    
    private final NoticeDao noticeDao;
    private final CategoryDao categoryDao;
    
    @Override
    public Notice createNotice(NoticeRequest request) {
        log.info("Creating notice with title: {}", request.getTitle());
        
        Notice notice = new Notice();
        notice.setTitle(request.getTitle());
        notice.setDescription(request.getDescription());
        notice.setCategory(request.getCategory());
        notice.setPriority(request.getPriority().toUpperCase());
        notice.setStatus(request.getStatus().toUpperCase());
        notice.setExpiryDate(request.getExpiryDate());
        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(LocalDateTime.now());
        
        // Auto-expire if expiry date is in the past
        if (request.getExpiryDate() != null && request.getExpiryDate().isBefore(LocalDate.now())) {
            notice.setStatus("EXPIRED");
        }
        
        Notice savedNotice = noticeDao.save(notice);
        
        // Update category count
        categoryDao.findByName(request.getCategory()).ifPresent(category -> {
            category.setCount(category.getCount() + 1);
            categoryDao.save(category);
        });
        
        log.info("Notice created successfully with ID: {}", savedNotice.getId());
        return savedNotice;
    }
    
    @Override
    public Notice updateNotice(String id, NoticeRequest request) {
        log.info("Updating notice with ID: {}", id);
        
        Notice notice = noticeDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with ID: " + id));
        
        String oldCategory = notice.getCategory();
        
        notice.setTitle(request.getTitle());
        notice.setDescription(request.getDescription());
        notice.setCategory(request.getCategory());
        notice.setPriority(request.getPriority().toUpperCase());
        notice.setStatus(request.getStatus().toUpperCase());
        notice.setExpiryDate(request.getExpiryDate());
        notice.setUpdatedAt(LocalDateTime.now());
        
        // Auto-expire if expiry date is in the past
        if (request.getExpiryDate() != null && request.getExpiryDate().isBefore(LocalDate.now())) {
            notice.setStatus("EXPIRED");
        }
        
        Notice updatedNotice = noticeDao.save(notice);
        
        // Update category counts if category changed
        if (!oldCategory.equals(request.getCategory())) {
            categoryDao.findByName(oldCategory).ifPresent(cat -> {
                cat.setCount(Math.max(0, cat.getCount() - 1));
                categoryDao.save(cat);
            });
            
            categoryDao.findByName(request.getCategory()).ifPresent(cat -> {
                cat.setCount(cat.getCount() + 1);
                categoryDao.save(cat);
            });
        }
        
        log.info("Notice updated successfully: {}", id);
        return updatedNotice;
    }
    
    @Override
    public void deleteNotice(String id) {
        log.info("Deleting notice with ID: {}", id);
        
        Notice notice = noticeDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with ID: " + id));
        
        // Update category count
        categoryDao.findByName(notice.getCategory()).ifPresent(category -> {
            category.setCount(Math.max(0, category.getCount() - 1));
            categoryDao.save(category);
        });
        
        noticeDao.deleteById(id);
        log.info("Notice deleted successfully: {}", id);
    }
    
    @Override
    public Notice getNoticeById(String id) {
        log.info("Fetching notice with ID: {}", id);
        return noticeDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with ID: " + id));
    }
    
    @Override
    public List<Notice> getAllNotices() {
        log.info("Fetching all notices");
        return noticeDao.findAll();
    }
    
    @Override
    public List<Notice> getActiveNotices() {
        log.info("Fetching active notices");
        return noticeDao.findActiveNotices();
    }
    
    @Override
    public List<Notice> getNoticesByCategory(String category) {
        log.info("Fetching notices by category: {}", category);
        return noticeDao.findByCategory(category);
    }
    
    @Override
    public List<Notice> getNoticesByStatus(String status) {
        log.info("Fetching notices by status: {}", status);
        return noticeDao.findByStatus(status.toUpperCase());
    }
}
