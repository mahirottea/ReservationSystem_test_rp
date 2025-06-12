'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function StaffNewPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [selectable, setSelectable] = useState(true);

  const handleSave = async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    await apiClient.post('/staffs', [
      { name, specialties, selectable, tenantId },
    ]);
    router.push('/admin/staff/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="スタッフ新規作成" />
        <input
          className="border p-2 w-full"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="得意"
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
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
          保存
        </button>
      </div>
    </AdminLayout>
  );
}
