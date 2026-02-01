package com.mvp.mood.session.dto;

import java.util.UUID;

/**
 * 创建 session 响应 DTO
 */
public class CreateSessionResponse {
    private String sessionId;

    public CreateSessionResponse() {
    }

    public CreateSessionResponse(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * 创建新的 session ID
     */
    public static CreateSessionResponse createNew() {
        return new CreateSessionResponse(UUID.randomUUID().toString());
    }
}
