'use client';

import Link from 'next/link';

export default function SettingCompletePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">設定が完了しました</h1>
        <p className="text-gray-600 mb-6">
          初期設定が正常に保存されました。ありがとうございました。
        </p>
        <div className="flex flex-col space-y-2">
          <Link href="/login">
            <span className="block px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
              ログイン画面へ進む
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
