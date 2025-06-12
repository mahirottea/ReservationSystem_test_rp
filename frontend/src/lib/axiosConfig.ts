import axios from 'axios';

// トークンが保存されている場合は共通ヘッダーに設定
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// APIベースURL設定
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default axios;
