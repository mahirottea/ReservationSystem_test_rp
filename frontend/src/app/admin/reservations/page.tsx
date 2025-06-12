'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';
import ReservationModal from '@/components/ReservationModal';
import { format } from 'date-fns';

interface Reservation {
  id: string;
  date: string;
  endDate?: string;
  note?: string;
  customer: { id: string; name: string; email: string; phone?: string };
  staff: { id: string; name: string };
  reservationItems: {
    serviceId: string;
    service: { id: string; name: string; duration: number; price?: number };
  }[];
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffId, setStaffId] = useState('');
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const loadReservations = async () => {
    const tenantId = localStorage.getItem('tenantId');
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const [staffRes, serviceRes, reservationRes] = await Promise.all([
      apiClient.get('/staffs', { params: { tenantId } }),
      apiClient.get('/services', { params: { tenantId } }),
      apiClient.get('/reservations/calendar', { params: { tenantId, from, to } }),
    ]);
    setStaffList(staffRes.data);
    setServiceList(serviceRes.data);
    setReservations(reservationRes.data.reservations);
  };

  useEffect(() => {
    loadReservations().catch(console.error);
  }, []);

  const openNew = () => {
    setSelectedReservation(null);
    setName('');
    setEmail('');
    setPhone('');
    setStaffId('');
    setServiceIds([]);
    setDate('');
    setNote('');
    setModalOpen(true);
  };

  const openEdit = (r: Reservation) => {
    setSelectedReservation(r);
    setName(r.customer.name);
    setEmail(r.customer.email);
    setPhone(r.customer.phone || '');
    setStaffId(r.staff.id);
    setServiceIds(r.reservationItems.map((i) => i.serviceId));
    const jst = new Date(new Date(r.date).getTime() + 9 * 60 * 60 * 1000);
    setDate(jst.toISOString().slice(0, 16));
    setNote(r.note || '');
    setModalOpen(true);
  };

  const fetchOrCreateCustomer = async (name: string, email: string, phone: string, tenantId: string | null) => {
    const res = await apiClient.get('/customers', { params: { email, tenantId } });
    if (res.data && res.data.length > 0) return res.data[0].id;
    const createRes = await apiClient.post('/customers', { name, email, phone, tenantId });
    return createRes.data.id;
  };

  const handleSave = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      const customerId = await fetchOrCreateCustomer(name, email, phone, tenantId);
      const selectedServices = serviceList.filter((s: any) => serviceIds.includes(s.id));
      const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0);
      const start = new Date(date);
      const end = new Date(start.getTime() + totalDuration * 60 * 1000);

      if (selectedReservation) {
        await apiClient.put(`/reservations/${selectedReservation.id}`, {
          customerId,
          staffId,
          serviceIds,
          date: start.toISOString(),
          endDate: end.toISOString(),
          note,
        });
      } else {
        await apiClient.post('/reservations', {
          customerId,
          staffId,
          serviceIds,
          tenantId,
          date: start.toISOString(),
          endDate: end.toISOString(),
          note,
        });
      }
      setModalOpen(false);
      loadReservations();
    } catch (err) {
      console.error('保存失敗', err);
    }
  };

  const handleDelete = async (id?: string) => {
    const targetId = id || selectedReservation?.id;
    if (!targetId) return;
    try {
      await apiClient.delete(`/reservations/${targetId}`);
      setModalOpen(false);
      loadReservations();
    } catch (err) {
      console.error('削除失敗', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <AdminPageHeader title="予約管理" />
        <button onClick={openNew} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
          新規予約
        </button>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">日時</th>
              <th className="p-2 border">顧客</th>
              <th className="p-2 border">担当</th>
              <th className="p-2 border">サービス</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-2 border">{format(new Date(r.date), 'yyyy-MM-dd HH:mm')}</td>
                <td className="p-2 border">{r.customer?.name}</td>
                <td className="p-2 border">{r.staff?.name}</td>
                <td className="p-2 border">{r.reservationItems.map((i) => i.service.name).join(', ')}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => openEdit(r)} className="text-blue-600 hover:underline">
                    編集
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('本当に削除しますか？')) {
                        handleDelete(r.id);
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-2 border text-center text-gray-500">
                  予約はありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ReservationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          reservationId={selectedReservation?.id || ''}
          data={{
            name,
            setName,
            email,
            setEmail,
            phone,
            setPhone,
            staffId,
            setStaffId,
            serviceIds,
            setServiceIds,
            date,
            setDate,
            note,
            setNote,
          }}
          staffList={staffList}
          serviceList={serviceList}
          useIndividualStaffSlots={false}
          individualSlotStats={null}
        />
      </div>
    </AdminLayout>
  );
}
