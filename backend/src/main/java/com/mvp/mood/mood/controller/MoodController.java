package com.mvp.mood.mood.controller;

import com.mvp.mood.mood.dto.*;
import com.mvp.mood.mood.service.MoodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 情绪记录控制器
 */
@RestController
@RequestMapping("/mood")
public class MoodController {
    private final MoodService moodService;

    @Autowired
    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    /**
     * 创建情绪记录
     * POST /mood
     */
    @PostMapping
    public ResponseEntity<MoodResponse> createMood(@Valid @RequestBody CreateMoodRequest request) {
        MoodResponse response = moodService.createMood(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 获取同情绪匿名池（最近24小时，最多3条）
     * GET /mood/others?moodScore=-1
     */
    @GetMapping("/others")
    public ResponseEntity<List<PublicMoodSnippetResponse>> getOthersMood(
            @RequestParam Integer moodScore) {
        List<PublicMoodSnippetResponse> responses = moodService.getOthersMood(moodScore);
        return ResponseEntity.ok(responses);
    }

    /**
     * 获取同情绪数量（最近24小时）
     * GET /mood/count?moodScore=-1
     */
    @GetMapping("/count")
    public ResponseEntity<CountResponse> getMoodCount(@RequestParam Integer moodScore) {
        CountResponse response = moodService.getMoodCount(moodScore);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取我的记录
     * GET /mood/me?sessionId=uuid&limit=7
     */
    @GetMapping("/me")
    public ResponseEntity<List<MoodResponse>> getMyMoods(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "7") int limit) {
        List<MoodResponse> responses = moodService.getMyMoods(sessionId, limit);
        return ResponseEntity.ok(responses);
    }
}
