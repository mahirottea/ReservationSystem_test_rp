'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axiosConfig';
import Cookies from 'js-cookie';

export default function SettingCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const clearAndRedirect = async () => {
      const rememberToken = Cookies.get('remember_token');
      if (rememberToken) {
        try {
          await axios.delete('/auth/remember-token', { data: { token: rememberToken } });
        } catch (error) {
          console.warn('トークン削除に失敗しました', error);
        }
        Cookies.remove('remember_token');
      }

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('tenantId');

      router.replace('/login');
    };

    clearAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">設定が完了しました</h1>
        <p className="text-gray-600 mb-6">
          初期設定が正常に保存されました。ありがとうございました。
        </p>
        <p className="text-gray-600">ログイン画面へリダイレクトしています...</p>
      </div>
    </div>
  );
}
