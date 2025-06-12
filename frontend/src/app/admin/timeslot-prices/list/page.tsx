'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface TimeSlotPrice {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
}

export default function TimeSlotPriceListPage() {
  const [items, setItems] = useState<TimeSlotPrice[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/timeslot-prices', { params: { tenantId } })
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <AdminPageHeader title="時間帯別料金一覧" />
          <Link href="/admin/timeslot-prices/new" className="px-3 py-1 rounded bg-blue-600 text-white">
            新規作成
          </Link>
        </div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">開始</th>
              <th className="p-2 border">終了</th>
              <th className="p-2 border">価格</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2 border">{item.startTime}</td>
                <td className="p-2 border">{item.endTime}</td>
                <td className="p-2 border">{item.price}</td>
                <td className="p-2 border">
                  <Link href={`/admin/timeslot-prices/${item.id}/edit`} className="text-blue-600 hover:underline">
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-2 border text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
