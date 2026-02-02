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
        setError('No session found, please record a mood first');
        setLoading(false);
        return;
      }

      try {
        const data = await getMyMoods(sessionId, 7);
        setMoods(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load records');
      } finally {
        setLoading(false);
      }
    }

    loadMyMoods();
  }, []);

  const getMoodLabel = (score: number) => {
    if (score === -1) return '😔 Down';
    if (score === 0) return '😐 Neutral';
    if (score === 1) return '😊 Happy';
    return '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container">
      <h1 className="title">My Records</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : error ? (
        <div className="empty-state" style={{ color: 'red' }}>{error}</div>
      ) : moods.length === 0 ? (
        <div className="empty-state">
          <p>No records yet</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/')}
            style={{ marginTop: '24px' }}
          >
            Go to record
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
            Back to home
          </button>
        </>
      )}
    </div>
  );
}
