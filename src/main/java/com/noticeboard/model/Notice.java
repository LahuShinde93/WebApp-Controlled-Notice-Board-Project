package com.noticeboard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notices")
public class Notice {
    
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    @Indexed
    private String category;
    
    private String priority; // HIGH, MEDIUM, LOW
    
    @Indexed
    private String status; // ACTIVE, INACTIVE, DRAFT, EXPIRED
    
    private LocalDate expiryDate;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
