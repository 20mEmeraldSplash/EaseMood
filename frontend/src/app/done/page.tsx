'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMoodCount, getOthersMood } from '@/lib/api';

/**
 * 提交后页：显示人数 + 3条匿名情绪
 */
export default function DonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moodScore = searchParams.get('moodScore');

  const [count, setCount] = useState<number | null>(null);
  const [othersMoods, setOthersMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      if (!moodScore) {
        setError('参数错误');
        setLoading(false);
        return;
      }

      try {
        const score = parseInt(moodScore);
        
        // 并行获取数量和匿名情绪
        const [countResponse, othersResponse] = await Promise.all([
          getMoodCount(score),
          getOthersMood(score),
        ]);

        setCount(countResponse.count);
        setOthersMoods(othersResponse.map((item) => item.text));
      } catch (err: any) {
        setError(err.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [moodScore]);

  const getMoodLabel = (score: number | null) => {
    if (score === null) return '';
    if (score === -1) return '低落';
    if (score === 0) return '平静';
    if (score === 1) return '开心';
    return '';
  };

  return (
    <div className="container">
      <h1 className="title">已记录</h1>

      {loading ? (
        <div className="empty-state">加载中...</div>
      ) : error ? (
        <div className="empty-state" style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          {/* 人数统计 */}
          <div className="card">
            <div style={{ textAlign: 'center', fontSize: '18px', lineHeight: '1.6' }}>
              {count !== null && count > 0 ? (
                <>
                  今天有 <strong>{count}</strong> 个人和你一样{getMoodLabel(parseInt(moodScore || '0'))}
                </>
              ) : (
                <>
                  你是今天第一个记录{getMoodLabel(parseInt(moodScore || '0'))}情绪的人
                </>
              )}
            </div>
          </div>

          {/* 匿名情绪列表 */}
          {othersMoods.length > 0 && (
            <div className="card">
              <h2 className="subtitle">其他人的情绪</h2>
              <ul className="mood-list">
                {othersMoods.map((text, index) => (
                  <li key={index} className="mood-item">
                    <div className="mood-text">{text}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 返回按钮 */}
          <button
            className="btn btn-secondary"
            onClick={() => router.push('/')}
          >
            够了，先这样吧
          </button>
        </>
      )}
    </div>
  );
}
