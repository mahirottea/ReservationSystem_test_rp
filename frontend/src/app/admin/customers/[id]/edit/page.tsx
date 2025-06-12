'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!id) return;
    apiClient
      .get(`/customers/${id}`)
      .then((res) => {
        setCustomer(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone || '');
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    await apiClient.put(`/customers/${id}`, { name, email, phone });
    router.push('/admin/customers/list');
  };

  const handleDelete = async () => {
    if (!id) return;
    await apiClient.delete(`/customers/${id}`);
    router.push('/admin/customers/list');
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <AdminPageHeader title="顧客情報" />
        {customer ? (
          <div className="space-y-4">
            <input
              className="border p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="space-x-2">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                更新
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                削除
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </AdminLayout>
  );
}
