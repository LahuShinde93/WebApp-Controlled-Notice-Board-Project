package com.noticeboard.service.impl;

import com.noticeboard.dao.CategoryDao;
import com.noticeboard.dao.NoticeDao;
import com.noticeboard.dto.response.DashboardResponse;
import com.noticeboard.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {
    
    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);
    
    private final NoticeDao noticeDao;
    private final CategoryDao categoryDao;
    
    public DashboardServiceImpl(NoticeDao noticeDao, CategoryDao categoryDao) {
        this.noticeDao = noticeDao;
        this.categoryDao = categoryDao;
    }
    
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
