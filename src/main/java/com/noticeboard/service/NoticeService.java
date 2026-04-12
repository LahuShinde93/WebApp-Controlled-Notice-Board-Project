package com.noticeboard.service;

import com.noticeboard.dto.request.NoticeRequest;
import com.noticeboard.model.Notice;

import java.util.List;

public interface NoticeService {
    
    Notice createNotice(NoticeRequest request);
    
    Notice updateNotice(String id, NoticeRequest request);
    
    void deleteNotice(String id);
    
    Notice getNoticeById(String id);
    
    List<Notice> getAllNotices();
    
    List<Notice> getActiveNotices();
    
    List<Notice> getNoticesByCategory(String category);
    
    List<Notice> getNoticesByStatus(String status);
}
