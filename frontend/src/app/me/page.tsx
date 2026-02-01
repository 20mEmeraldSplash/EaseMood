'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyMoods, getOrCreateSessionId } from '@/lib/api';
import type { MoodResponse } from '@/lib/api';

/**
 * 回看页：最近7条记录
 */
export default function MePage() {
  const router = useRouter();
  const [moods, setMoods] = useState<MoodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadMyMoods() {
      const sessionId = getOrCreateSessionId();
      if (!sessionId) {
        setError('未找到会话记录，请先记录一次情绪');
        setLoading(false);
        return;
      }

      try {
        const data = await getMyMoods(sessionId, 7);
        setMoods(data);
      } catch (err: any) {
        setError(err.message || '加载记录失败');
      } finally {
        setLoading(false);
      }
    }

    loadMyMoods();
  }, []);

  const getMoodLabel = (score: number) => {
    if (score === -1) return '😔 低落';
    if (score === 0) return '😐 平静';
    if (score === 1) return '😊 开心';
    return '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container">
      <h1 className="title">我的记录</h1>

      {loading ? (
        <div className="empty-state">加载中...</div>
      ) : error ? (
        <div className="empty-state" style={{ color: 'red' }}>{error}</div>
      ) : moods.length === 0 ? (
        <div className="empty-state">
          <p>还没有记录</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/')}
            style={{ marginTop: '24px' }}
          >
            去记录
          </button>
        </div>
      ) : (
        <>
          <ul className="mood-list">
            {moods.map((mood) => (
              <li key={mood.id} className="mood-item">
                <div className="mood-score">{getMoodLabel(mood.moodScore)}</div>
                {mood.text && (
                  <div className="mood-text">{mood.text}</div>
                )}
                <div className="mood-date">{formatDate(mood.createdAt)}</div>
              </li>
            ))}
          </ul>

          <button
            className="btn btn-secondary"
            onClick={() => router.push('/')}
          >
            返回首页
          </button>
        </>
      )}
    </div>
  );
}
