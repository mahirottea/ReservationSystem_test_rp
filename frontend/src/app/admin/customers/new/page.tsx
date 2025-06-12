'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function CustomerNewPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    await apiClient.post('/customers', { name, email, phone, tenantId });
    router.push('/admin/customers/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="顧客新規作成" />
        <input
          className="border p-2 w-full"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="メール"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="電話"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
          保存
        </button>
      </div>
    </AdminLayout>
  );
}
