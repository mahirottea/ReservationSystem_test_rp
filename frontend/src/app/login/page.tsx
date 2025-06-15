'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/login";
import { useAuth } from "../context/AuthContext";
import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";

export default function LoginPage() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  // cookieから初期値を読み取る
  const [email, setEmail] = useState(() => Cookies.get("email") || "");
  const [password, setPassword] = useState(() => Cookies.get("password") || "");

  // ✅ localStorageを毎回初期化（ログイン画面が表示されたら）
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const tenantId =
      typeof window !== "undefined" && localStorage.getItem("tenantId");

    if (role === "admin") {
      if (!tenantId) {
        router.replace("/admin/calendar");
        return;
      }

      const checkSettings = async () => {
        try {
          await apiClient.get("/settings", { params: { tenantId } });
          router.replace("/admin/calendar");
        } catch (err: any) {
          if (err.response?.status === 404) {
            router.replace("/settings/common");
          } else {
            console.error(err);
            alert("設定取得に失敗しました");
          }
        }
      };

      checkSettings();
    } else {
      router.replace("/user/calendar");
    }
  }, [isAuthenticated, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ cookie にログイン情報を保存
      Cookies.set("email", email, { expires: 7 });
      Cookies.set("password", password, { expires: 7 });

      const { role } = await login(email, password);
      if (role === "admin") {
        const tenantId =
          typeof window !== "undefined" && localStorage.getItem("tenantId");
        if (tenantId) {
          try {
            await apiClient.get('/settings', { params: { tenantId } });
            router.push('/admin/calendar');
          } catch (err: any) {
            if (err.response?.status === 404) {
              router.push('/settings/common');
            } else {
              console.error(err);
              alert('設定取得に失敗しました');
            }
          }
        } else {
          router.push('/admin/calendar');
        }
      } else {
        router.push("/user/calendar");
      }
    } catch (error) {
      alert("ログインに失敗しました。");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 mb-4"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}
