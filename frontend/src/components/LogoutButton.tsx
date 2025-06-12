'use client';

import axios from "@/lib/axiosConfig";
import Cookies from "js-cookie";
import { useAuth } from "app/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const token = Cookies.get("remember_token");

    // ✅ サーバーへ削除リクエスト
    if (token) {
      try {
        await axios.delete("/auth/remember-token", {
          data: { token },
        });
      } catch (error) {
        console.warn("トークン削除に失敗しました", error);
      }
    }

    Cookies.remove("remember_token"); // ✅ cookie削除
    logout(); // ✅ ローカル状態クリア
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      ログアウト
    </button>
  );
}
