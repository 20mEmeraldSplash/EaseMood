package com.mvp.mood.mood.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 创建情绪记录请求 DTO
 */
public class CreateMoodRequest {
    @NotNull(message = "sessionId 不能为空")
    private String sessionId;

    @NotNull(message = "moodScore 不能为空")
    private Integer moodScore; // -1, 0, or 1

    @Size(max = 140, message = "文字不能超过140字")
    private String text;

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
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
}
