'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Staff {
  id: string;
  name: string;
  selectable?: boolean;
  specialties?: string;
}

export default function StaffEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [name, setName] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [selectable, setSelectable] = useState(true);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!id || !tenantId) return;
    apiClient
      .get(`/staffs/${id}`)
      .then((res) => {
        const s: Staff = res.data;
        setStaff(s);
        setName(s.name);
        setSpecialties(s.specialties || '');
        setSelectable(s.selectable ?? true);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    await apiClient.put(`/staffs/${id}`, {
      name,
      specialties,
      selectable,
    });
    router.push('/admin/staff/list');
  };

  const handleDelete = async () => {
    if (!id) return;
    await apiClient.delete(`/staffs/${id}`);
    router.push('/admin/staff/list');
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <AdminPageHeader title="スタッフ情報" />
        {staff ? (
          <div className="space-y-4">
            <input
              className="border p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectable}
                onChange={(e) => setSelectable(e.target.checked)}
              />
              <span>指名可</span>
            </label>
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
