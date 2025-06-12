'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Coupon {
  tenantId: string;
  firstTime: number;
  repeat: number;
}

export default function CouponPage() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [firstTime, setFirstTime] = useState('0');
  const [repeat, setRepeat] = useState('0');

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/coupons', { params: { tenantId } })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const c = res.data[0] as Coupon;
          setCoupon(c);
          setFirstTime(String(c.firstTime));
          setRepeat(String(c.repeat));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    await apiClient.put(`/coupons/${tenantId}`, {
      firstTime: Number(firstTime),
      repeat: Number(repeat),
      tenantId,
    });
    alert('保存しました');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="クーポン設定" />
        <input
          className="border p-2 w-full"
          type="number"
          value={firstTime}
          onChange={(e) => setFirstTime(e.target.value)}
          placeholder="初回割引(%)"
        />
        <input
          className="border p-2 w-full"
          type="number"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          placeholder="再来割引(%)"
        />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
          保存
        </button>
      </div>
    </AdminLayout>
  );
}
