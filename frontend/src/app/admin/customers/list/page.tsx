'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/customers', { params: { tenantId } })
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <AdminPageHeader title="顧客一覧" />
          <Link href="/admin/customers/new" className="px-3 py-1 rounded bg-blue-600 text-white">
            新規作成
          </Link>
        </div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">氏名</th>
              <th className="p-2 border">メール</th>
              <th className="p-2 border">電話</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.email}</td>
                <td className="p-2 border">{c.phone || ''}</td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/customers/${c.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-2 border text-center text-gray-500">
                  顧客がいません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
