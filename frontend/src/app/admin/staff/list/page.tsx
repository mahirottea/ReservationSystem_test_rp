'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Staff {
  id: string;
  name: string;
}

export default function StaffListPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/staffs', { params: { tenantId } })
      .then((res) => setStaffs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <AdminPageHeader title="スタッフ一覧" />
          <Link href="/admin/staff/new" className="px-3 py-1 rounded bg-blue-600 text-white">
            新規作成
          </Link>
        </div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">名前</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/staff/${s.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {staffs.length === 0 && (
              <tr>
                <td colSpan={2} className="p-2 border text-center text-gray-500">
                  スタッフがいません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
