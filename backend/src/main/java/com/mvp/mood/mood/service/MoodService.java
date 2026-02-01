package com.mvp.mood.mood.service;

import com.mvp.mood.mood.dto.*;
import com.mvp.mood.mood.model.MoodEntry;
import com.mvp.mood.mood.repository.MoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 情绪记录服务
 */
@Service
public class MoodService {
    private final MoodRepository moodRepository;

    @Autowired
    public MoodService(MoodRepository moodRepository) {
        this.moodRepository = moodRepository;
    }

    /**
     * 创建情绪记录
     */
    @Transactional
    public MoodResponse createMood(CreateMoodRequest request) {
        // 验证 moodScore 只能是 -1, 0, 1
        if (request.getMoodScore() < -1 || request.getMoodScore() > 1) {
            throw new IllegalArgumentException("moodScore 只能是 -1, 0, 或 1");
        }

        MoodEntry entry = new MoodEntry();
        entry.setSessionId(request.getSessionId());
        entry.setMoodScore(request.getMoodScore());
        entry.setText(request.getText());

        MoodEntry saved = moodRepository.save(entry);
        return new MoodResponse(saved.getId(), saved.getMoodScore(), saved.getText(), saved.getCreatedAt());
    }

    /**
     * 获取同情绪匿名池（最近24小时，最多3条，只返回有文字的）
     */
    public List<PublicMoodSnippetResponse> getOthersMood(Integer moodScore) {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<MoodEntry> entries = moodRepository.findRecentByMoodScore(moodScore, since);

        // 过滤出有文字的，取前3条
        return entries.stream()
                .filter(e -> e.getText() != null && !e.getText().trim().isEmpty())
                .limit(3)
                .map(e -> new PublicMoodSnippetResponse(e.getText()))
                .collect(Collectors.toList());
    }

    /**
     * 获取同情绪数量（最近24小时）
     */
    public CountResponse getMoodCount(Integer moodScore) {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        Long count = moodRepository.countByMoodScoreSince(moodScore, since);
        return new CountResponse(count);
    }

    /**
     * 获取我的记录
     */
    public List<MoodResponse> getMyMoods(String sessionId, int limit) {
        List<MoodEntry> entries = moodRepository.findBySessionIdOrderByCreatedAtDesc(sessionId);
        return entries.stream()
                .limit(limit)
                .map(e -> new MoodResponse(e.getId(), e.getMoodScore(), e.getText(), e.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
