'use client';

import { useState } from 'react';
import { registerUser } from '../../lib/api/register';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 初期値: user
  const [name, setName] = useState('');
  const [tenantId, setTenantId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(email, password, role, name, tenantId);
      alert('登録が完了しました。ログインしてください。');
      router.push('/login');
    } catch (error) {
      alert('登録に失敗しました。');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">新規登録</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 mb-4"
        />
        <input
          type="text"
          placeholder="テナントID"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          required
          className="w-full border p-2 mb-4"
        />
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 mb-4"
        >
          <option value="user">ユーザー</option>
          <option value="admin">管理者</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          登録
        </button>
      </form>
    </main>
  );
}
