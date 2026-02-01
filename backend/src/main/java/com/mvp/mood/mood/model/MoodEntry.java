package com.mvp.mood.mood.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 情绪记录实体
 */
@Entity
@Table(name = "mood_entries")
public class MoodEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @NotNull
    @Column(name = "mood_score", nullable = false)
    private Integer moodScore; // -1, 0, or 1

    @Column(name = "text", length = 140)
    private String text;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
