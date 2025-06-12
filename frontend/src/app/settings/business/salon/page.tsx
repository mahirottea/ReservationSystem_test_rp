'use client';

import { useState, useEffect } from 'react';
import { saveSetting } from '@/lib/api/saveSetting';
import { useRouter, useSearchParams  } from 'next/navigation';
import type { SalonSettingData } from '@/types/business';

type Props = {
  onChange?: (data: SalonSettingData) => void;
  useIndividualStaffSlots: boolean;
};

  type Staff = {
    name: string;
    selectable: boolean;
    specialties: string;
    maxSlots?: number; // ← 追加
  };

export default function SalonSettingPage({ onChange, useIndividualStaffSlots }: Props) {

  const router = useRouter();
  const [staffList, setStaffList] = useState<Staff[]>([{ name: '', selectable: false, specialties: '', maxSlots: 3 },]);
  const [menuList, setMenuList] = useState([{ name: '', time: '', price: '', allowMultiple: false }]);
  const [allowNomination, setAllowNomination] = useState(true);
  const [coupon, setCoupon] = useState({ firstTime: 0, repeat: 0 });
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('ti');
  
  useEffect(() => {
    onChange?.({ staffList, menuList, coupon, allowNomination });
  }, [staffList, menuList, coupon, allowNomination]);

  const updateStaff = <T extends keyof Staff>(index: number, field: T, value: Staff[T]) => {
    const updated = [...staffList];
    updated[index][field] = value;
    setStaffList(updated);
  };


  const handleSubmit = async () => {

  if (!tenantId ) {
    alert('URLに必要な情報が含まれていません');
    return;
  }

  const payload = {
    tenantId,
    tenant: {}, // ← 編集不要のため空にしてOK
    admin: {},  // ← 編集不要のため空にしてOK
    setting: {
      allowNomination, // ← 指名可の設定
    },
    staffList,
    menuList,
    coupon,
  };

  try {
    const res = await saveSetting(payload, tenantId);
    router.push('/settings/complete');
  } catch (e) {
    console.error('保存エラー:', e);
    alert('保存に失敗しました');
  }
  };


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">美容サロン 専用設定</h1>

      {/* スタッフ設定 */}
      <h2 className="text-lg font-semibold">スタッフ設定</h2>
      {staffList.map((staff, idx) => (
        <div key={idx} className="border p-2 mt-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="名前"
            value={staff.name}
            onChange={(e) => updateStaff(idx, 'name', e.target.value)}
          />
          <label className="mr-2">
            <input
              type="checkbox"
              checked={staff.selectable}
              onChange={(e) => updateStaff(idx, 'selectable', e.target.checked)}
            /> 指名可
          </label>
          <input
            className="border p-1 w-full mt-1"
            placeholder="得意メニュー"
            value={staff.specialties}
            onChange={(e) => updateStaff(idx, 'specialties', e.target.value)}
          />

          {useIndividualStaffSlots && (
            <div>
              <label className="block mb-1">予約単位ごとの最大予約枠</label>
              <input
                type="number"
                min={0}
                value={staff.maxSlots ?? ''}
                onChange={(e) => updateStaff(idx, 'maxSlots', Number(e.target.value))}
                className="border p-1 w-full"
              />
            </div>
          )}
        </div>
      ))}
      <button className="mt-2 px-2 py-1 bg-gray-300" onClick={() => setStaffList([...staffList, { name: '', selectable: false, specialties: '' }])}>
        + スタッフ追加
      </button>

      {/* メニュー設定 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">サービスメニュー設定</h2>
        {menuList.map((menu, idx) => (
          <div key={idx} className="border p-2 mt-2">
            <input
              className="border p-1 w-full mb-1"
              placeholder="メニュー名"
              value={menu.name}
              onChange={(e) => {
                const updated = [...menuList];
                updated[idx].name = e.target.value;
                setMenuList(updated);
              }}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="所要時間（分）"
              value={menu.time}
              onChange={(e) => {
                const updated = [...menuList];
                updated[idx].time = e.target.value;
                setMenuList(updated);
              }}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="料金（円）"
              value={menu.price}
              onChange={(e) => {
                const updated = [...menuList];
                updated[idx].price = e.target.value;
                setMenuList(updated);
              }}
            />
            <label>
              <input
                type="checkbox"
                checked={menu.allowMultiple}
                onChange={(e) => {
                  const updated = [...menuList];
                  updated[idx].allowMultiple = e.target.checked;
                  setMenuList(updated);
                }}
              /> 複数予約許可
            </label>
          </div>
        ))}
        <button className="mt-2 px-2 py-1 bg-gray-300" onClick={() => setMenuList([...menuList, { name: '', time: '', price: '', allowMultiple: false }])}>
          + メニュー追加
        </button>
      </div>

      {/* 指名予約 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">指名予約</h2>
        <label>
          <input
            type="checkbox"
            checked={allowNomination}
            onChange={(e) => setAllowNomination(e.target.checked)}
          /> 指名予約を許可する
        </label>
      </div>

      {/* クーポン設定 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">クーポン・割引設定</h2>
        <label className="block mb-1">初回割引（%）</label>
        <input
          type="number"
          className="border p-1 w-full mb-2"
          value={coupon.firstTime}
          onChange={(e) => setCoupon({ ...coupon, firstTime: Number(e.target.value) })}
        />
        <label className="block mb-1">再来割引（%）</label>
        <input
          type="number"
          className="border p-1 w-full"
          value={coupon.repeat}
          onChange={(e) => setCoupon({ ...coupon, repeat: Number(e.target.value) })}
        />
      </div>

    </div>
  );
}
