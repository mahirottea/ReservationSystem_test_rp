'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface SeatType {
  id: string;
  name: string;
  capacity: number;
}

export default function SeatTypeEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (!id) return;
    apiClient
      .get(`/seat-types/${id}`)
      .then((res) => {
        const data: SeatType = res.data;
        setName(data.name);
        setCapacity(String(data.capacity));
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    await apiClient.put(`/seat-types/${id}`, { name, capacity: Number(capacity) });
    router.push('/admin/seat-types/list');
  };

  const handleDelete = async () => {
    if (!id) return;
    await apiClient.delete(`/seat-types/${id}`);
    router.push('/admin/seat-types/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="席タイプ編集" />
        <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full" value={capacity} onChange={(e) => setCapacity(e.target.value)} type="number" />
        <div className="space-x-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">更新</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">削除</button>
        </div>
      </div>
    </AdminLayout>
  );
}
