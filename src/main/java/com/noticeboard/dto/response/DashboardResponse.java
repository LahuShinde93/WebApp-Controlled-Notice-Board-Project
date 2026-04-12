package com.noticeboard.dto.response;

public class DashboardResponse {
    
    private Long totalNotices;
    private Long activeNotices;
    private Long expiredNotices;
    private Long totalCategories;
    
    public DashboardResponse() {
    }
    
    public DashboardResponse(Long totalNotices, Long activeNotices, Long expiredNotices, Long totalCategories) {
        this.totalNotices = totalNotices;
        this.activeNotices = activeNotices;
        this.expiredNotices = expiredNotices;
        this.totalCategories = totalCategories;
    }
    
    public Long getTotalNotices() {
        return totalNotices;
    }
    
    public void setTotalNotices(Long totalNotices) {
        this.totalNotices = totalNotices;
    }
    
    public Long getActiveNotices() {
        return activeNotices;
    }
    
    public void setActiveNotices(Long activeNotices) {
        this.activeNotices = activeNotices;
    }
    
    public Long getExpiredNotices() {
        return expiredNotices;
    }
    
    public void setExpiredNotices(Long expiredNotices) {
        this.expiredNotices = expiredNotices;
    }
    
    public Long getTotalCategories() {
        return totalCategories;
    }
    
    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }
}
