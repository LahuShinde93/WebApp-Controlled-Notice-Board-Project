package com.noticeboard.repository;

import com.noticeboard.model.Notice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {
    
    List<Notice> findByStatus(String status);
    
    List<Notice> findByCategory(String category);
    
    List<Notice> findByStatusOrderByCreatedAtDesc(String status);
    
    List<Notice> findAllByOrderByCreatedAtDesc();
    
    Long countByStatus(String status);
}
