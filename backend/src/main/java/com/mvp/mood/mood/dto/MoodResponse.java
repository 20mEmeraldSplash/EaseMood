package com.mvp.mood.mood.dto;

import java.time.LocalDateTime;

/**
 * 情绪记录响应 DTO
 */
public class MoodResponse {
    private Long id;
    private Integer moodScore;
    private String text;
    private LocalDateTime createdAt;

    public MoodResponse() {
    }

    public MoodResponse(Long id, Integer moodScore, String text, LocalDateTime createdAt) {
        this.id = id;
        this.moodScore = moodScore;
        this.text = text;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMoodScore() {
        return moodScore;
    }

    public void setMoodScore(Integer moodScore) {
        this.moodScore = moodScore;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
