/**
 * API 客户端
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface CreateSessionResponse {
  sessionId: string;
}

export interface CreateMoodRequest {
  sessionId: string;
  moodScore: number;
  text?: string;
}

export interface MoodResponse {
  id: number;
  moodScore: number;
  text?: string;
  createdAt: string;
}

export interface PublicMoodSnippetResponse {
  text: string;
}

export interface CountResponse {
  count: number;
}

/**
 * 创建匿名 session
 */
export async function createSession(): Promise<CreateSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('创建 session 失败');
  }
  return response.json();
}

/**
 * 创建情绪记录
 */
export async function createMood(request: CreateMoodRequest): Promise<MoodResponse> {
  const response = await fetch(`${API_BASE_URL}/mood`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '创建情绪记录失败');
  }
  return response.json();
}

/**
 * 获取同情绪匿名池
 */
export async function getOthersMood(moodScore: number): Promise<PublicMoodSnippetResponse[]> {
  const response = await fetch(`${API_BASE_URL}/mood/others?moodScore=${moodScore}`);
  if (!response.ok) {
    throw new Error('获取匿名情绪失败');
  }
  return response.json();
}

/**
 * 获取同情绪数量
 */
export async function getMoodCount(moodScore: number): Promise<CountResponse> {
  const response = await fetch(`${API_BASE_URL}/mood/count?moodScore=${moodScore}`);
  if (!response.ok) {
    throw new Error('获取情绪数量失败');
  }
  return response.json();
}

/**
 * 获取我的记录
 */
export async function getMyMoods(sessionId: string, limit: number = 7): Promise<MoodResponse[]> {
  const response = await fetch(`${API_BASE_URL}/mood/me?sessionId=${sessionId}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('获取我的记录失败');
  }
  return response.json();
}

/**
 * 获取或创建 session ID
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  
  let sessionId = localStorage.getItem('mood_session_id');
  if (!sessionId) {
    // 如果本地没有，先返回临时值，页面加载后会创建
    sessionId = '';
  }
  return sessionId;
}

/**
 * 保存 session ID
 */
export function saveSessionId(sessionId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mood_session_id', sessionId);
  }
}
