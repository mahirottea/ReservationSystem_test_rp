'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function TimeSlotPriceNewPage() {
  const router = useRouter();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [serviceId, setServiceId] = useState('');

  const handleSave = async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    await apiClient.post('/timeslot-prices', {
      startTime,
      endTime,
      price: Number(price),
      serviceId,
      tenantId,
    });
    router.push('/admin/timeslot-prices/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="時間帯別料金新規作成" />
        <input className="border p-2 w-full" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="開始" />
        <input className="border p-2 w-full" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="終了" />
        <input className="border p-2 w-full" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="価格" type="number" />
        <input className="border p-2 w-full" value={serviceId} onChange={(e) => setServiceId(e.target.value)} placeholder="サービスID" />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
      </div>
    </AdminLayout>
  );
}
