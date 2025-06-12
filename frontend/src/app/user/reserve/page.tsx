'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import apiClient from '@/lib/apiClient';

interface Service { id: string; name: string; duration: number; }
interface Staff { id: string; name: string; }

export default function ReservePage() {
  const router = useRouter();
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffId, setStaffId] = useState('');
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient.get('/services', { params: { tenantId } }).then(res => setServiceList(res.data));
    apiClient.get('/staffs', { params: { tenantId } }).then(res => setStaffList(res.data));
  }, []);

  const fetchOrCreateCustomer = async (tenantId: string|null) => {
    if (!tenantId) throw new Error('tenant missing');
    const res = await apiClient.get('/customers', { params: { email, tenantId } });
    if (res.data && res.data.length > 0) return res.data[0].id;
    const createRes = await apiClient.post('/customers', { name, email, phone, tenantId });
    return createRes.data.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tenantId = localStorage.getItem('tenantId');
      const customerId = await fetchOrCreateCustomer(tenantId);
      const selected = serviceList.filter(s => serviceIds.includes(s.id));
      const total = selected.reduce((sum, s) => sum + (s.duration || 0), 0);
      const start = new Date(date);
      const end = new Date(start.getTime() + total * 60000);
      const res = await apiClient.post('/reservations', {
        customerId,
        staffId,
        serviceIds,
        tenantId,
        date: start.toISOString(),
        endDate: end.toISOString(),
        note,
      });
      router.push(`/user/reserve/confirm/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('予約に失敗しました');
    }
  };

  return (
    <RoleGuard allowedRoles={['user']}>
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-bold">予約作成</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">氏名</label>
            <input className="border p-2 w-full" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">メール</label>
            <input type="email" className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">電話番号</label>
            <input className="border p-2 w-full" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">スタッフ</label>
            <select value={staffId} onChange={e => setStaffId(e.target.value)} className="border p-2 w-full">
              <option value="">選択してください</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">コース</label>
            <div className="space-y-1 border rounded p-2 max-h-40 overflow-y-auto">
              {serviceList.map(s => (
                <label key={s.id} className="flex items-center space-x-2">
                  <input type="checkbox" value={s.id} checked={serviceIds.includes(s.id)} onChange={e => {
                    const checked = e.target.checked;
                    setServiceIds(ids =>
                      checked ? [...ids, s.id] : ids.filter(itemId => itemId !== s.id)
                    );
                  }} />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">予約日時</label>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="border p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium">備考</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} className="border p-2 w-full" rows={3}></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">予約する</button>
        </form>
      </main>
    </RoleGuard>
  );
}
