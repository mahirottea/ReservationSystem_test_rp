'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function AnalyticsPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/analytics/summary', { params: { tenantId } })
      .then((res) => {
        setTotalSales(res.data.totalSales);
        setTotalReservations(res.data.totalReservations);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="分析サマリー" />
        <div className="p-4 bg-white shadow rounded">
          <p className="text-sm text-gray-500">総売上</p>
          <p className="text-2xl font-bold">{totalSales}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <p className="text-sm text-gray-500">総予約数</p>
          <p className="text-2xl font-bold">{totalReservations}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
