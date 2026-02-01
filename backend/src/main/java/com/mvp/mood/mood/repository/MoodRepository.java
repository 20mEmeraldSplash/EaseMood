package com.mvp.mood.mood.repository;

import com.mvp.mood.mood.model.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 情绪记录 Repository
 */
@Repository
public interface MoodRepository extends JpaRepository<MoodEntry, Long> {
    /**
     * 根据 sessionId 查询记录，按创建时间倒序
     */
    List<MoodEntry> findBySessionIdOrderByCreatedAtDesc(String sessionId);

    /**
     * 查询最近24小时内指定情绪分数的记录（用于匿名池）
     */
    @Query("SELECT m FROM MoodEntry m WHERE m.moodScore = :moodScore AND m.createdAt >= :since ORDER BY m.createdAt DESC")
    List<MoodEntry> findRecentByMoodScore(@Param("moodScore") Integer moodScore, @Param("since") LocalDateTime since);

    /**
     * 统计最近24小时内指定情绪分数的数量
     */
    @Query("SELECT COUNT(m) FROM MoodEntry m WHERE m.moodScore = :moodScore AND m.createdAt >= :since")
    Long countByMoodScoreSince(@Param("moodScore") Integer moodScore, @Param("since") LocalDateTime since);
}
