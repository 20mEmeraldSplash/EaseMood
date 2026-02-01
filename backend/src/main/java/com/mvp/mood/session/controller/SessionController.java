package com.mvp.mood.session.controller;

import com.mvp.mood.session.dto.CreateSessionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Session 控制器
 * 注意：后端不持久化 session，只返回 UUID
 */
@RestController
@RequestMapping("/session")
public class SessionController {
    /**
     * 创建匿名 session
     * POST /session
     */
    @PostMapping
    public ResponseEntity<CreateSessionResponse> createSession() {
        CreateSessionResponse response = CreateSessionResponse.createNew();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
