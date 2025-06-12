'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface SeatType {
  id: string;
  name: string;
  capacity: number;
}

export default function SeatTypeListPage() {
  const [items, setItems] = useState<SeatType[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/seat-types', { params: { tenantId } })
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <AdminPageHeader title="席タイプ一覧" />
          <Link href="/admin/seat-types/new" className="px-3 py-1 rounded bg-blue-600 text-white">
            新規作成
          </Link>
        </div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">名前</th>
              <th className="p-2 border">人数</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.capacity}</td>
                <td className="p-2 border">
                  <Link href={`/admin/seat-types/${item.id}/edit`} className="text-blue-600 hover:underline">
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="p-2 border text-center text-gray-500">
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
