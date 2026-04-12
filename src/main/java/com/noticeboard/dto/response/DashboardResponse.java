package com.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    
    private Long totalNotices;
    private Long activeNotices;
    private Long expiredNotices;
    private Long totalCategories;
}
