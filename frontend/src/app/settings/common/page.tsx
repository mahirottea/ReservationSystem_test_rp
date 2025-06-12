'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveSetting } from '@/lib/api/saveSetting';
import SalonSettingPage from '../business/salon/page';
import ClinicSettingPage from '../business/clinic/page';
import RentalSettingPage from '../business/rental/page';
import RestaurantSettingPage from '../business/restaurant/page';
import CarSettingPage from '../business/car/page';
import EventSettingPage from '../business/event/page';
import SchoolSettingPage from '../business/school/page';
import type { BusinessFormData, SalonSettingData } from '@/types/business';

export default function CommonSettingPage() {
  const router = useRouter();

  const [shopInfo, setShopInfo] = useState({ name: '', address: '', phone: '' });
  const [businessHours, setBusinessHours] = useState<string[]>([]);
  const [receptionTime, setReceptionTime] = useState({ start: '09:00', end: '20:00' });
  const [closedDays, setClosedDays] = useState<string[]>([]);
  const [periodMonths, setPeriodMonths] = useState(1);
  const [customerInfoRequired, setCustomerInfoRequired] = useState({ phone: true, email: false });
  const [notifications, setNotifications] = useState({ reserve: false, remind: false });
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '', password: '' });
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [special, setSpecial] = useState<BusinessFormData | null>(null);
  const [maxReservations, setMaxReservations] = useState(3);
  const [reservationUnitMinutes, setReservationUnitMinutes] = useState(60);
  const [useIndividualStaffSlots, setUseIndividualStaffSlots] = useState<boolean>(false);

  useEffect(() => {
    const businessType = localStorage.getItem('selectedBusiness');
    if (businessType) {
      setSelectedBusiness(businessType);
    } else {
      alert('業種が選択されていません。トップページからやり直してください。');
      router.push('/');
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        tenant: {
          name: shopInfo.name,
          address: shopInfo.address,
          phone: shopInfo.phone,
          type: selectedBusiness,
          email: adminInfo.email,
        },
        setting: {
          businessDays: businessHours,
          startTime: receptionTime.start,
          endTime: receptionTime.end,
          closedDays: closedDays,
          reservationMax: periodMonths,
          requirePhone: customerInfoRequired.phone,
          requireEmail: customerInfoRequired.email,
          notifyReservation: notifications.reserve,
          notifyReminder: notifications.remind,
          allowNomination: (special as SalonSettingData | null)?.allowNomination,
          maxReservations: maxReservations,
          reservationUnitMinutes: reservationUnitMinutes,
          useIndividualStaffSlots: useIndividualStaffSlots,
        },
        admin: {
          name: adminInfo.name,
          email: adminInfo.email,
          password: adminInfo.password,
        },
        ...(special ?? {}),
      };

      const response = await saveSetting(payload);
      const tenantId = response.tenantId;
      if (tenantId) {
        router.push(`/settings/complete`);
      } else {
        alert('保存結果が不正です。');
      }
    } catch (error) {
      console.error('保存に失敗しました:', error);
      alert('保存に失敗しました。再度お試しください。');
    }
  };

  const toggleDay = (day: string, list: string[], setter: (days: string[]) => void) => {
    if (list.includes(day)) {
      setter(list.filter(d => d !== day));
    } else {
      setter([...list, day]);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">基本設定（全業種共通）</h2>

      {/* 店舗情報 */}
      <div>
        <label className="block font-semibold">店舗名</label>
        <input className="border w-full p-2" value={shopInfo.name} onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })} />
        <label className="block font-semibold mt-2">住所</label>
        <input className="border w-full p-2" value={shopInfo.address} onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })} />
        <label className="block font-semibold mt-2">電話番号</label>
        <input className="border w-full p-2" value={shopInfo.phone} onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })} />
      </div>

      {/* 営業曜日 */}
      <div>
        <label className="block font-semibold">営業曜日</label>
        {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
          <button
            type="button"
            key={day}
            className={`px-2 py-1 mr-2 mt-2 border rounded ${businessHours.includes(day) ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => toggleDay(day, businessHours, setBusinessHours)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 受付時間 */}
      <div>
        <label className="block font-semibold">予約受付時間</label>
        <div className="flex gap-2 items-center">
          <input type="time" value={receptionTime.start} onChange={(e) => setReceptionTime({ ...receptionTime, start: e.target.value })} />
          <span>〜</span>
          <input type="time" value={receptionTime.end} onChange={(e) => setReceptionTime({ ...receptionTime, end: e.target.value })} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">同時刻最大予約数</label>
        <input
          type="number"
          min={1}
          max={10}
          value={maxReservations}
          onChange={(e) => setMaxReservations(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useIndividualStaffSlots}
            onChange={(e) => setUseIndividualStaffSlots(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-medium">スタッフ別に予約枠数を設ける</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">予約単位（分）</label>
        <select
          value={reservationUnitMinutes}
          onChange={(e) => setReservationUnitMinutes(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[15, 30, 60, 90, 120, 180].map((unit) => (
            <option key={unit} value={unit}>{unit}分</option>
          ))}
        </select>
      </div>

      {/* 定休日 */}
      <div>
        <label className="block font-semibold">定休日</label>
        {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
          <button
            type="button"
            key={day}
            className={`px-2 py-1 mr-2 mt-2 border rounded ${closedDays.includes(day) ? 'bg-red-400 text-white' : ''}`}
            onClick={() => toggleDay(day, closedDays, setClosedDays)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 予約可能期間 */}
      <div>
        <label className="block font-semibold">予約可能期間（月）</label>
        <input type="number" min={1} max={24} value={periodMonths} onChange={(e) => setPeriodMonths(Number(e.target.value))} className="border p-2 w-20" />
      </div>

      {/* ✅ 管理者情報入力欄 */}
      <div>
        <label className="block font-semibold">管理者情報</label>
        <input
          className="border w-full p-2 my-1"
          placeholder="氏名"
          value={adminInfo.name}
          onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
        />
        <input
          type="email"
          className="border w-full p-2 my-1"
          placeholder="メールアドレス"
          value={adminInfo.email}
          onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
        />
        <input
          type="password"
          className="border w-full p-2 my-1"
          placeholder="パスワード"
          value={adminInfo.password}
          onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })}
        />
      </div>

      {/* 顧客情報 */}
      <div>
        <label className="block font-semibold">顧客情報の入力必須</label>
        <label><input type="checkbox" checked={customerInfoRequired.phone} onChange={(e) => setCustomerInfoRequired({ ...customerInfoRequired, phone: e.target.checked })} /> 電話番号</label>
        <label className="ml-4"><input type="checkbox" checked={customerInfoRequired.email} onChange={(e) => setCustomerInfoRequired({ ...customerInfoRequired, email: e.target.checked })} /> メールアドレス</label>
      </div>

      {/* 通知設定 */}
      <div>
        <label className="block font-semibold">通知設定</label>
        <label><input type="checkbox" checked={notifications.reserve} onChange={(e) => setNotifications({ ...notifications, reserve: e.target.checked })} /> 予約受付通知</label>
        <label className="ml-4"><input type="checkbox" checked={notifications.remind} onChange={(e) => setNotifications({ ...notifications, remind: e.target.checked })} /> リマインド通知</label>
      </div>
      
      
      {/* 業種ごとの専用設定 */}
      {(() => {
        switch (selectedBusiness) {
          case 'salon':
            return (
              <SalonSettingPage
                useIndividualStaffSlots={useIndividualStaffSlots}
                onChange={(data) => setSpecial(data)}
              />
            );
          case 'clinic':
            return <ClinicSettingPage onChange={setSpecial} />;
          case 'rental':
            return <RentalSettingPage onChange={setSpecial} />;
          case 'restaurant':
            return <RestaurantSettingPage onChange={setSpecial} />;
          case 'car':
            return <CarSettingPage onChange={setSpecial} />;
          case 'event':
            return <EventSettingPage onChange={setSpecial} />;
          case 'school':
            return <SchoolSettingPage onChange={setSpecial} />;
          default:
            return null;
        }
      })()}

      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>保存</button>

    </div>
  );
}
