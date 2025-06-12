import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 🔐 リクエスト前にJWTトークンを自動付与
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ❌ 401（Unauthorized）を検知して自動ログアウト
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('token'); // トークン削除
      window.location.href = '/login';  // 強制遷移
    }
    return Promise.reject(error);
  }
);

export default apiClient;
