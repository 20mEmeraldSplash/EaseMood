'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, createMood, getOrCreateSessionId, saveSessionId } from '@/lib/api';

/**
 * 首页：情绪滑块 + 一句话 + 提交
 */
export default function HomePage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // 初始化 session
  useEffect(() => {
    async function initSession() {
      const existingSessionId = getOrCreateSessionId();
      if (existingSessionId) {
        setSessionId(existingSessionId);
      } else {
        try {
          const response = await createSession();
          saveSessionId(response.sessionId);
          setSessionId(response.sessionId);
        } catch (err) {
          setError('初始化失败，请刷新页面重试');
        }
      }
    }
    initSession();
  }, []);

  const handleSubmit = async () => {
    if (moodScore === null) {
      setError('请选择你的情绪');
      return;
    }

    if (!sessionId) {
      setError('会话未初始化，请刷新页面');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createMood({
        sessionId,
        moodScore,
        text: text.trim() || undefined,
      });
      // 跳转到完成页，传递 moodScore
      router.push(`/done?moodScore=${moodScore}`);
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
      setIsSubmitting(false);
    }
  };

  const moodOptions = [
    { score: -1, emoji: '😔', label: '低落' },
    { score: 0, emoji: '😐', label: '平静' },
    { score: 1, emoji: '😊', label: '开心' },
  ];

  return (
    <div className="container">
      <h1 className="title">记录你的情绪</h1>

      {/* 情绪选择 */}
      <div className="mood-slider">
        {moodOptions.map((option) => (
          <div
            key={option.score}
            className={`mood-option ${moodScore === option.score ? 'selected' : ''}`}
            onClick={() => {
              setMoodScore(option.score);
              setError('');
            }}
          >
            <div className="emoji">{option.emoji}</div>
            <div className="label">{option.label}</div>
          </div>
        ))}
      </div>

      {/* 文字输入 */}
      <div className="card">
        <textarea
          className="textarea"
          placeholder="想说点什么吗？（可选，最多140字）"
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= 140) {
              setText(e.target.value);
            }
          }}
          maxLength={140}
        />
        <div className="char-count">{text.length}/140</div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* 提交按钮 */}
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting || moodScore === null}
      >
        {isSubmitting ? '提交中...' : '放下它'}
      </button>

      {/* 回看链接 */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a
          href="/me"
          style={{ color: '#0070f3', textDecoration: 'none', fontSize: '14px' }}
        >
          查看我的记录
        </a>
      </div>
    </div>
  );
}
