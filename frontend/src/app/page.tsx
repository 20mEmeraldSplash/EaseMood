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
          setError('Initialization failed, please refresh and try again');
        }
      }
    }
    initSession();
  }, []);

  const handleSubmit = async () => {
    if (moodScore === null) {
      setError('Please select your mood');
      return;
    }

    if (!sessionId) {
      setError('Session not initialized, please refresh the page');
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
      setError(err.message || 'Submission failed, please try again');
      setIsSubmitting(false);
    }
  };

  const moodOptions = [
    { score: -1, emoji: '😔', label: 'Down' },
    { score: 0, emoji: '😐', label: 'Neutral' },
    { score: 1, emoji: '😊', label: 'Happy' },
  ];

  return (
    <div className="container">
      <h1 className="title">How are you feeling?</h1>

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
          placeholder="Want to say something? (Optional, max 140 characters)"
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
        {isSubmitting ? 'Submitting...' : 'Let it go'}
      </button>

      {/* 回看链接 */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a
          href="/me"
          style={{ color: '#0070f3', textDecoration: 'none', fontSize: '14px' }}
        >
          View my records
        </a>
      </div>
    </div>
  );
}
