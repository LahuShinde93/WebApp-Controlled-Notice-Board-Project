package com.noticeboard.dao;

import com.noticeboard.model.Notice;

import java.util.List;
import java.util.Optional;

public interface NoticeDao {
    
    Notice save(Notice notice);
    
    Optional<Notice> findById(String id);
    
    List<Notice> findAll();
    
    List<Notice> findByStatus(String status);
    
    List<Notice> findByCategory(String category);
    
    List<Notice> findActiveNotices();
    
    void deleteById(String id);
    
    Long countByStatus(String status);
    
    Long count();
}
