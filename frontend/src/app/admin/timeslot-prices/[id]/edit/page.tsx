'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface TimeSlotPrice {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  serviceId: string;
}

export default function TimeSlotPriceEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<TimeSlotPrice | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [serviceId, setServiceId] = useState('');

  useEffect(() => {
    if (!id) return;
    apiClient
      .get(`/timeslot-prices/${id}`)
      .then((res) => {
        const data: TimeSlotPrice = res.data;
        setItem(data);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setPrice(String(data.price));
        setServiceId(data.serviceId);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    await apiClient.put(`/timeslot-prices/${id}`, {
      startTime,
      endTime,
      price: Number(price),
      serviceId,
    });
    router.push('/admin/timeslot-prices/list');
  };

  const handleDelete = async () => {
    if (!id) return;
    await apiClient.delete(`/timeslot-prices/${id}`);
    router.push('/admin/timeslot-prices/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="時間帯別料金編集" />
        {item ? (
          <>
            <input className="border p-2 w-full" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input className="border p-2 w-full" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <input className="border p-2 w-full" value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
            <input className="border p-2 w-full" value={serviceId} onChange={(e) => setServiceId(e.target.value)} />
            <div className="space-x-2">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">更新</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">削除</button>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </AdminLayout>
  );
}
