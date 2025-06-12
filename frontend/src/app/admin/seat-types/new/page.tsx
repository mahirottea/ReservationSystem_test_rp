'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function SeatTypeNewPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleSave = async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    await apiClient.post('/seat-types', { name, capacity: Number(capacity), tenantId });
    router.push('/admin/seat-types/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="席タイプ新規作成" />
        <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" />
        <input className="border p-2 w-full" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="人数" type="number" />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
      </div>
    </AdminLayout>
  );
}
