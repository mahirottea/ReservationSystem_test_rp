'use client'
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import RoleGuard from '@/components/RoleGuard';

interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
}

export default function ServiceList() {
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
    <RoleGuard allowedRoles={['user']}>
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">メニュー一覧</h1>
        <ul className="space-y-2">
          {services.map((s) => (
            <li key={s.id} className="border p-2 rounded">
              <div className="font-semibold">{s.name}</div>
              <div>時間: {s.duration}分</div>
              {s.price !== undefined && <div>価格: {s.price}円</div>}
            </li>
          ))}
          {services.length === 0 && <li>メニューがありません</li>}
        </ul>
      </main>
    </RoleGuard>
  );
}
