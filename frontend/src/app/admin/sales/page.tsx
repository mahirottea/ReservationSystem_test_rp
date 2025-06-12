'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Reservation {
  date: string;
  reservationItems: {
    serviceId: string;
    service: { name: string; price: number };
  }[];
}

export default function SalesPage() {
  const [data, setData] = useState<{ name: string; revenue: number }[]>([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const to = new Date().toISOString();
    apiClient
      .get('/reservations/calendar', { params: { tenantId, from, to } })
      .then((res) => {
        const reservations: Reservation[] = res.data.reservations || [];
        const map: Record<string, { name: string; revenue: number }> = {};

        let daily = 0;
        let weekly = 0;
        let monthly = 0;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        for (const r of reservations) {
          const resDate = new Date(r.date);
          for (const item of r.reservationItems) {
            const { serviceId, service } = item;
            if (!map[serviceId]) {
              map[serviceId] = { name: service.name, revenue: 0 };
            }
            map[serviceId].revenue += service.price;

            if (resDate >= startOfToday) daily += service.price;
            if (resDate >= startOfWeek) weekly += service.price;
            if (resDate >= startOfMonth) monthly += service.price;
          }
        }

        setData(Object.values(map));
        setDailyTotal(daily);
        setWeeklyTotal(weekly);
        setMonthlyTotal(monthly);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <AdminPageHeader title="売上管理" />
        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">今日の売上</p>
            <p className="text-2xl font-bold">{dailyTotal}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">今週の売上</p>
            <p className="text-2xl font-bold">{weeklyTotal}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">今月の売上</p>
            <p className="text-2xl font-bold">{monthlyTotal}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
