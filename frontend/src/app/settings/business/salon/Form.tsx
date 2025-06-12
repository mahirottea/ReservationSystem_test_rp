'use client';

import { useState } from 'react';

export default function SalonForm({ formData, setFormData }: any) {
  const [staffList, setStaffList] = useState(formData.staffList || []);
  const [menuList, setMenuList] = useState(formData.menuList || []);
  const [allowNomination, setAllowNomination] = useState(formData.allowNomination || false);
  const [coupon, setCoupon] = useState(formData.coupon || { firstTime: 0, repeat: 0 });

  const updateStaff = (index: number, key: string, value: any) => {
    const updated = [...staffList];
    updated[index][key] = value;
    setStaffList(updated);
    setFormData({ ...formData, staffList: updated });
  };

  const addStaff = () => {
    const newItem = { name: '', selectable: false, specialties: '' };
    const updated = [...staffList, newItem];
    setStaffList(updated);
    setFormData({ ...formData, staffList: updated });
  };

  const updateMenu = (index: number, key: string, value: any) => {
    const updated = [...menuList];
    updated[index][key] = value;
    setMenuList(updated);
    setFormData({ ...formData, menuList: updated });
  };

  const addMenu = () => {
    const newItem = { name: '', time: '', price: '', allowMultiple: false };
    const updated = [...menuList, newItem];
    setMenuList(updated);
    setFormData({ ...formData, menuList: updated });
  };

  const toggleNomination = () => {
    const updated = !allowNomination;
    setAllowNomination(updated);
    setFormData({ ...formData, allowNomination: updated });
  };

  const updateCoupon = (key: string, value: number) => {
    const updated = { ...coupon, [key]: value };
    setCoupon(updated);
    setFormData({ ...formData, coupon: updated });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold mb-2">スタッフ設定</h2>
        {staffList.map((s: any, i: number) => (
          <div key={i} className="border p-4 rounded mb-3">
            <input
              type="text"
              placeholder="名前"
              className="border p-2 w-full mb-2"
              value={s.name}
              onChange={(e) => updateStaff(i, 'name', e.target.value)}
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={s.selectable}
                onChange={(e) => updateStaff(i, 'selectable', e.target.checked)}
              />
              指名可能
            </label>
            <input
              type="text"
              placeholder="得意メニュー"
              className="border p-2 w-full"
              value={s.specialties}
              onChange={(e) => updateStaff(i, 'specialties', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addStaff}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + スタッフ追加
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">メニュー設定</h2>
        {menuList.map((m: any, i: number) => (
          <div key={i} className="border p-4 rounded mb-3">
            <input
              type="text"
              placeholder="メニュー名"
              className="border p-2 w-full mb-2"
              value={m.name}
              onChange={(e) => updateMenu(i, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="所要時間（分）"
              className="border p-2 w-full mb-2"
              value={m.time}
              onChange={(e) => updateMenu(i, 'time', Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="料金（円）"
              className="border p-2 w-full mb-2"
              value={m.price}
              onChange={(e) => updateMenu(i, 'price', Number(e.target.value))}
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={m.allowMultiple}
                onChange={(e) => updateMenu(i, 'allowMultiple', e.target.checked)}
              />
              複数予約可能
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addMenu}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + メニュー追加
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">指名予約</h2>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={allowNomination}
            onChange={toggleNomination}
          />
          指名予約を許可する
        </label>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">クーポン・割引設定</h2>
        <input
          type="number"
          placeholder="初回割引（%）"
          className="border p-2 w-full mb-2"
          value={coupon.firstTime}
          onChange={(e) => updateCoupon('firstTime', Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="再来割引（%）"
          className="border p-2 w-full"
          value={coupon.repeat}
          onChange={(e) => updateCoupon('repeat', Number(e.target.value))}
        />
      </section>
    </div>
  );
}
