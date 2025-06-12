'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  allowMultiple: boolean;
}

export default function ServiceListPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/services', { params: { tenantId } })
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <AdminPageHeader title="メニュー一覧" />
          <Link
            href="/admin/services/new"
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            新規作成
          </Link>
        </div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">名前</th>
              <th className="p-2 border">時間(分)</th>
              <th className="p-2 border">価格</th>
              <th className="p-2 border">複数予約</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.duration}</td>
                <td className="p-2 border">{s.price}</td>
                <td className="p-2 border">{s.allowMultiple ? '可' : '不可'}</td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/services/${s.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-2 border text-center text-gray-500">
                  メニューがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
