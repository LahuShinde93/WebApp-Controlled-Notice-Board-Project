package com.noticeboard.service.impl;

import com.noticeboard.dao.CategoryDao;
import com.noticeboard.dao.NoticeDao;
import com.noticeboard.dto.response.DashboardResponse;
import com.noticeboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {
    
    private final NoticeDao noticeDao;
    private final CategoryDao categoryDao;
    
    @Override
    public DashboardResponse getDashboardStats() {
        log.info("Fetching dashboard statistics");
        
        Long totalNotices = noticeDao.count();
        Long activeNotices = noticeDao.countByStatus("ACTIVE");
        Long expiredNotices = noticeDao.countByStatus("EXPIRED");
        Long totalCategories = categoryDao.count();
        
        DashboardResponse response = new DashboardResponse(
                totalNotices,
                activeNotices,
                expiredNotices,
                totalCategories
        );
        
        log.info("Dashboard stats: Total={}, Active={}, Expired={}, Categories={}", 
                totalNotices, activeNotices, expiredNotices, totalCategories);
        
        return response;
    }
}
