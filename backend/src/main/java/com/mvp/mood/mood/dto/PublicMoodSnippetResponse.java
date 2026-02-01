package com.mvp.mood.mood.dto;

/**
 * 匿名情绪片段响应 DTO（只包含文字）
 */
public class PublicMoodSnippetResponse {
    private String text;

    public PublicMoodSnippetResponse() {
    }

    public PublicMoodSnippetResponse(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
