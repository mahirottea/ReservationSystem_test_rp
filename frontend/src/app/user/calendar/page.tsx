'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import RoleGuard from '@/components/RoleGuard';
import CustomerReservationModal from '@/components/CustomerReservationModal';
import apiClient from '@/lib/apiClient';

export default function UserCalendarPage() {
  type ReservationData = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    staffId: string;
    serviceIds: string[];
    date: string;
    note?: string;
  };
  type SlotStatus = {
    used: number;
    remaining: number;
    status: string; // ◎, 〇, △, ×
  };

  const [events, setEvents] = useState<EventInput[]>([]);
  const [currentRange, setCurrentRange] = useState<{ from: string; to: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
  const [calendarRange, setCalendarRange] = useState<{
    min: string;
    max: string;
    unit: number;
    maxReservations: number;
    closedDays: string[];
    useIndividualStaffSlots: boolean;
  }>({
    min: '08:00:00',
    max: '19:00:00',
    unit: 60,
    maxReservations: 3,
    closedDays: [],
    useIndividualStaffSlots: false,
  });
  const [slotStats, setSlotStats] = useState<Record<string, Record<string, SlotStatus>>>({});
  const [rawEvents, setRawEvents] = useState<EventInput[]>([]);
  const [individualSlotStats, setIndividualSlotStats] =
    useState<Record<string, Record<string, Record<string, number>>>>({});
  const [staffList, setStaffList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffId, setStaffId] = useState('');
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [calendarViewType, setCalendarViewType] = useState('timeGridWeek');

  const statusStyleMap: Record<string, { backgroundColor: string; textColor: string }> = {
    '◎': { backgroundColor: '#d1fae5', textColor: '#000' },
    '〇': { backgroundColor: '#bfdbfe', textColor: '#000' },
    '△': { backgroundColor: '#fee2e2', textColor: '#000' },
    '×': { backgroundColor: '#374151', textColor: '#fff' },
  };

  const getDayLabel = (dateStr: string): string => {
    const day = new Date(dateStr).getDay();
    const map = ['日', '月', '火', '水', '木', '金', '土'];
    return map[day];
  };

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return target < today;
  };

  const openModal = (arg: any) => {
    if (isPastDate(arg.dateStr)) return;
    setSelectedReservation(null);
    setDate(arg.dateStr || '');
    setName('');
    setEmail('');
    setPhone('');
    setStaffId('');
    setNote('');
    setModalOpen(true);
    setServiceIds([]);

    const jst = new Date(arg.date.getTime() + 9 * 60 * 60 * 1000);
    const formatted = jst.toISOString().slice(0, 16);
    setDate(formatted);
  };

  const fetchReservations = async (range: { from: string; to: string }) => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      const res = await apiClient.get('/reservations/calendar', {
        params: {
          from: range.from,
          to: range.to,
          tenantId,
        },
      });

      const formatted = res.data.reservations.map((r: any) => {
        const services = r.reservationItems?.map((i: any) => i.service?.name).filter(Boolean) || [];
        return {
          id: r.id,
          title: `${r.customer?.name || '無名'} - ${services.join('・')}`,
          start: r.date,
          end: r.endDate,
          backgroundColor: '#60a5fa',
          extendedProps: {
            name: r.customer?.name || '',
            email: r.customer?.email || '',
            phone: r.customer?.phone || '',
            staffId: r.staffId || '',
            serviceIds: r.reservationItems?.map((i: any) => i.serviceId) || [],
            note: r.note || '',
          },
        };
      });
      const totalMax = res.data.totalMax || calendarRange.maxReservations;
      return {
        rawEvents: formatted,
        slotStats: res.data.slots,
        maxReservations: totalMax,
        individualSlotStats: res.data.individualSlotStats,
      };
    } catch (err) {
      console.error('予約取得エラー:', err);
      return null;
    }
  };

  function generateTimeSlots(start: string, end: string, unit: number): string[] {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startH, startM, 0, 0);
    const endDate = new Date();
    endDate.setHours(endH, endM, 0, 0);

    const times: string[] = [];
    for (let t = new Date(startDate); t < endDate; t.setMinutes(t.getMinutes() + unit)) {
      times.push(t.toTimeString().slice(0, 5));
    }
    return times;
  }

  function calcRemaining(
    date: string,
    slots: Record<string, SlotStatus>,
    individual: Record<string, Record<string, Record<string, number>>>
  ): number {
    return Object.keys(slots).reduce(
      (sum, time) => sum + Object.values(individual[date]?.[time] || {}).reduce((a, b) => a + b, 0),
      0
    );
  }

  const handleDatesSet = async (arg: any) => {
    const from = arg.startStr;
    const to = arg.endStr;
    const viewType = arg.view.type;
    setCurrentRange({ from, to });
    setCalendarViewType(viewType);

    const result = await fetchReservations({ from, to });
    if (!result) return;

    setRawEvents(result.rawEvents);
    setSlotStats(result.slotStats);
    setCalendarRange((prev) => ({
      ...prev,
      maxReservations: result.maxReservations,
    }));
    setIndividualSlotStats(result.individualSlotStats || {});

    const unit = calendarRange.unit || 60;
    const startTime = calendarRange.min.slice(0, 5);
    const endTime = calendarRange.max.slice(0, 5);
    const allTimeSlots = generateTimeSlots(startTime, endTime, unit);

    const days: string[] = [];
    const current = new Date(from);
    const endDate = new Date(to);
    while (current <= endDate) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    const newMarks: EventInput[] = [];

    days.forEach((date) => {
      const isPast = isPastDate(date);
      const dayLabel = getDayLabel(date);
      const stats = result.slotStats;
      const slots = stats[date] || {};

      allTimeSlots.forEach((time) => {
        if (!slots[time]) {
          slots[time] = {
            used: 0,
            remaining: result.maxReservations,
            status: '◎',
          };
        }
      });

      if (viewType === 'dayGridMonth') {
        const statuses = Object.values(slots).map((s) => (s as SlotStatus).status);
        const status = statuses.includes('×')
          ? '×'
          : statuses.includes('△')
          ? '△'
          : statuses.includes('〇')
          ? '〇'
          : '◎';
        const style = statusStyleMap[status] || { backgroundColor: '#fff', textColor: '#000' };
        newMarks.push({
          title: status,
          start: date,
          allDay: true,
          display: 'auto',
          textColor: isPast ? '#000' : style.textColor,
          backgroundColor: isPast ? '#808080' : calendarRange.closedDays.includes(dayLabel) ? '#ffe4e6' : style.backgroundColor,
        });

        const remaining = calcRemaining(date, slots as Record<string, SlotStatus>, result.individualSlotStats || {});
        newMarks.push({
          title: `残：${remaining}枠`,
          start: date,
          allDay: true,
          display: 'auto',
          textColor: 'black',
          color: 'transparent',
        });
      } else if (viewType === 'timeGridWeek') {
        Object.entries(slots).forEach(([time, val]) => {
          const slotVal = val as SlotStatus;
          const datetime = `${date}T${time}`;
          const style = statusStyleMap[slotVal.status] || { backgroundColor: '#fff', textColor: '#000' };
          newMarks.push({
            title: slotVal.status,
            start: datetime,
            display: 'auto',
            textColor: isPast ? '#000' : style.textColor,
            backgroundColor: isPast ? '#808080' : calendarRange.closedDays.includes(dayLabel) ? '#ffe4e6' : style.backgroundColor,
          });
        });

        const remaining = calcRemaining(date, slots as Record<string, SlotStatus>, result.individualSlotStats || {});
        newMarks.push({
          title: `残：${remaining}枠`,
          start: date,
          allDay: true,
          display: 'auto',
          textColor: 'black',
          color: 'transparent',
        });
      }
    });

    if (viewType === 'timeGridDay') {
      setEvents(result.rawEvents);
    } else {
      setEvents(newMarks);
    }
  };

  const fetchOrCreateCustomer = async (
    name: string,
    email: string,
    phone: string,
    tenantId: string | null
  ) => {
    try {
      const res = await apiClient.get('/customers', { params: { email, tenantId } });
      if (res.data && res.data.length > 0) {
        return res.data[0].id;
      }
      const createRes = await apiClient.post('/customers', {
        name,
        email,
        phone,
        tenantId,
      });
      return createRes.data.id;
    } catch (err) {
      console.error('顧客の取得または作成に失敗しました', err);
      throw err;
    }
  };

  const handleSave = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      const customerId = await fetchOrCreateCustomer(name, email, phone, tenantId);

      const selectedServices = serviceIds.map((id) => ({ id }));
      const totalDuration = 0; // omit duration calc for simplicity

      const start = new Date(date);
      const end = new Date(start.getTime() + totalDuration * 60 * 1000);

      if (selectedReservation && selectedReservation.id) {
        await apiClient.put(`/reservations/${selectedReservation.id}`, {
          customerId,
          staffId,
          serviceIds,
          date: date ? new Date(date).toISOString() : undefined,
          endDate: end ? end.toISOString() : undefined,
          note,
        });
      } else {
        await apiClient.post('/reservations', {
          customerId,
          staffId,
          serviceIds,
          tenantId,
          date: new Date(date).toISOString(),
          endDate: end.toISOString(),
          note,
        });
      }
      setModalOpen(false);
      if (currentRange) {
        const result = await fetchReservations(currentRange);
        if (result) {
          setRawEvents(result.rawEvents);
          setSlotStats(result.slotStats);
          setCalendarRange((prev) => ({
            ...prev,
            maxReservations: result.maxReservations,
          }));
        }
      }
    } catch (err) {
      console.error('保存失敗', err);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedReservation?.id) {
        await apiClient.delete(`/reservations/${selectedReservation.id}`);
        setModalOpen(false);
        if (currentRange) fetchReservations(currentRange);
      }
    } catch (e) {
      console.error('削除失敗', e);
    }
  };

  const handleEventClick = (event: any) => {
    if (isPastDate(event.startStr)) return;
    const extendedProps = event.extendedProps;
    setSelectedReservation({
      id: event.id,
      name: extendedProps.name,
      email: extendedProps.email,
      phone: extendedProps.phone,
      staffId: extendedProps.staffId,
      serviceIds: extendedProps.serviceIds || [],
      date: event.startStr,
      note: extendedProps.note || '',
    });
    setName(extendedProps.name);
    setEmail(extendedProps.email);
    setPhone(extendedProps.phone);
    setStaffId(extendedProps.staffId);
    setServiceIds(extendedProps.serviceIds || []);
    const jstDate = new Date(new Date(event.start).getTime() + 9 * 60 * 60 * 1000);
    const formatted = jstDate.toISOString().slice(0, 16);
    setDate(formatted);
    setNote(extendedProps.note || '');
    setModalOpen(true);
  };

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient.get('/staffs', { params: { tenantId } }).then((res) => setStaffList(res.data));
    apiClient.get('/services', { params: { tenantId } }).then((res) => setServiceList(res.data));
  }, []);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;

    apiClient.get(`/settings?tenantId=${tenantId}`).then((res) => {
      const setting = res.data;
      const start = parseInt(setting.startTime?.split(':')[0] || '9');
      const end = parseInt(setting.endTime?.split(':')[0] || '18');
      setCalendarRange({
        min: `${Math.max(start - 1, 0)}:00:00`,
        max: `${Math.min(end + 1, 23)}:00:00`,
        unit: setting.reservationUnitMinutes || 60,
        maxReservations: setting.maxReservations || 3,
        closedDays: setting.closedDays || [],
        useIndividualStaffSlots: setting.useIndividualStaffSlots || false,
      });
    });
  }, []);

  return (
    <RoleGuard allowedRoles={['user']}>
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-bold">予約カレンダー</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="ja"
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          dateClick={openModal}
          datesSet={handleDatesSet}
          eventClick={(info) => handleEventClick(info.event)}
          slotMinTime={calendarRange.min}
          slotMaxTime={calendarRange.max}
          eventOverlap={true}
          slotEventOverlap={true}
          eventMaxStack={3}
        />
        <CustomerReservationModal
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
        />
      </main>
    </RoleGuard>
  );
}
