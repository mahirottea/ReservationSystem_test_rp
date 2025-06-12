'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Reservation {
  id: string;
  date: string;
  customer: { name: string };
  staff: { name: string };
  reservationItems: {
    service: { name: string; price?: number };
  }[];
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ customers: 0, staff: 0, services: 0, reservations: 0 });
  const [recent, setRecent] = useState<Reservation[]>([]);
  const [serviceSummary, setServiceSummary] = useState<{ name: string; count: number }[]>([]);
  const [staffSummary, setStaffSummary] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    Promise.all([
      apiClient.get('/customers', { params: { tenantId } }),
      apiClient.get('/staffs', { params: { tenantId } }),
      apiClient.get('/services', { params: { tenantId } }),
      apiClient.get('/reservations/calendar', { params: { tenantId, from, to } }),
    ])
      .then(([cusRes, staffRes, serviceRes, reservationRes]) => {
        setCounts({
          customers: cusRes.data.length,
          staff: staffRes.data.length,
          services: serviceRes.data.length,
          reservations: reservationRes.data.reservations.length,
        });
        const reservations: Reservation[] = reservationRes.data.reservations || [];
        const sorted = reservations
          .slice()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecent(sorted);

        const serviceMap: Record<string, number> = {};
        const staffMap: Record<string, number> = {};
        for (const r of reservations) {
          const staffName = r.staff?.name || '未設定';
          staffMap[staffName] = (staffMap[staffName] || 0) + 1;
          for (const item of r.reservationItems) {
            const name = item.service.name;
            serviceMap[name] = (serviceMap[name] || 0) + 1;
          }
        }
        setServiceSummary(
          Object.entries(serviceMap).map(([name, count]) => ({ name, count }))
        );
        setStaffSummary(
          Object.entries(staffMap).map(([name, count]) => ({ name, count }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <AdminPageHeader title="ダッシュボード" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">顧客数</p>
            <p className="text-2xl font-bold">{counts.customers}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">スタッフ数</p>
            <p className="text-2xl font-bold">{counts.staff}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">メニュー数</p>
            <p className="text-2xl font-bold">{counts.services}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">予約数</p>
            <p className="text-2xl font-bold">{counts.reservations}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500 mb-2">サービス別予約数</p>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <BarChart data={serviceSummary}>
                  <XAxis dataKey="name" hide={serviceSummary.length > 5} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500 mb-2">スタッフ別予約数</p>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <BarChart data={staffSummary}>
                  <XAxis dataKey="name" hide={staffSummary.length > 5} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#38a169" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-2">直近の予約</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">日時</th>
              <th className="p-2 border">顧客</th>
              <th className="p-2 border">担当</th>
              <th className="p-2 border">サービス</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-2 border">{format(new Date(r.date), 'yyyy-MM-dd HH:mm')}</td>
                <td className="p-2 border">{r.customer?.name}</td>
                <td className="p-2 border">{r.staff?.name}</td>
                <td className="p-2 border">
                  {r.reservationItems.map((i) => i.service.name).join(', ')}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={4} className="p-2 border text-center text-gray-500">
                  予約はありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
