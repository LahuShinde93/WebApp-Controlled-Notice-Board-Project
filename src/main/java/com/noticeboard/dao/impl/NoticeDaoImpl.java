package com.noticeboard.dao.impl;

import com.noticeboard.dao.NoticeDao;
import com.noticeboard.model.Notice;
import com.noticeboard.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NoticeDaoImpl implements NoticeDao {
    
    private final NoticeRepository noticeRepository;
    
    @Override
    public Notice save(Notice notice) {
        return noticeRepository.save(notice);
    }
    
    @Override
    public Optional<Notice> findById(String id) {
        return noticeRepository.findById(id);
    }
    
    @Override
    public List<Notice> findAll() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @Override
    public List<Notice> findByStatus(String status) {
        return noticeRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    @Override
    public List<Notice> findByCategory(String category) {
        return noticeRepository.findByCategory(category);
    }
    
    @Override
    public List<Notice> findActiveNotices() {
        return noticeRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }
    
    @Override
    public void deleteById(String id) {
        noticeRepository.deleteById(id);
    }
    
    @Override
    public Long countByStatus(String status) {
        return noticeRepository.countByStatus(status);
    }
    
    @Override
    public Long count() {
        return noticeRepository.count();
    }
}
