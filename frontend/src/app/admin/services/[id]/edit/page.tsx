'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!id || !tenantId) return;
    apiClient
      .get('/services', { params: { tenantId } })
      .then((res) => {
        const s = res.data.find((sv: Service) => sv.id === id);
        setService(s || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <AdminLayout>
      <div className="p-4">
        <AdminPageHeader title="メニュー情報" />
        {service ? (
          <div className="space-y-2">
            <div>名前: {service.name}</div>
            <div>時間: {service.duration} 分</div>
            <div>価格: {service.price} 円</div>
            <div>複数予約: {service.allowMultiple ? '可' : '不可'}</div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </AdminLayout>
  );
}
