'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function ServiceNewPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [allowMultiple, setAllowMultiple] = useState(false);

  const handleSave = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      await apiClient.post('/services', {
        name,
        duration: Number(duration),
        price: Number(price),
        allowMultiple,
        tenantId,
      });
      router.push('/admin/services/list');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="メニュー新規作成" />
        <div className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="時間(分)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="価格"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
            />
            <span>複数予約を許可</span>
          </label>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          保存
        </button>
      </div>
    </AdminLayout>
  );
}
