'use client'
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import RoleGuard from '@/components/RoleGuard';

interface Staff {
  id: string;
  name: string;
}

export default function StaffList() {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/staffs', { params: { tenantId } })
      .then((res) => setStaff(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <RoleGuard allowedRoles={['user']}>
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">スタッフ一覧</h1>
        <ul className="space-y-2">
          {staff.map((s) => (
            <li key={s.id} className="border p-2 rounded">
              {s.name}
            </li>
          ))}
          {staff.length === 0 && <li>スタッフが登録されていません</li>}
        </ul>
      </main>
    </RoleGuard>
  );
}
