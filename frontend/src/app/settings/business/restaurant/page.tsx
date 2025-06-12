'use client';

import { useState, useEffect } from 'react';
import { saveSetting } from '@/lib/api/saveSetting';
import { useRouter } from 'next/navigation';
import type { RestaurantSettingData } from '@/types/business';

type Props = {
  onChange?: (data: RestaurantSettingData) => void;
};

export default function RestaurantSettingPage({ onChange }: Props) {

  const router = useRouter();
  const [seats, setSeats] = useState([{ type: '', count: '' }]);
  const [courses, setCourses] = useState([{ name: '', price: '', preOrder: false }]);
  const [maxGuests, setMaxGuests] = useState(0);
  const [cancelPolicy, setCancelPolicy] = useState('');

  useEffect(() => {
    onChange?.({ seats, courses, maxGuests, cancelPolicy });
  }, [seats, courses, maxGuests, cancelPolicy]);

  const handleSubmit = async () => {
    const payload = {
      type: 'restaurant',
      seats,
      courses,
      maxGuests,
      cancelPolicy,
    };

    try {
      const res = await saveSetting(payload);
      router.push('/settings/complete');
    } catch (e) {
      alert('保存に失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">飲食店・居酒屋 専用設定</h1>

      {/* 座席タイプ */}
      <h2 className="text-lg font-semibold mb-2">座席タイプ設定</h2>
      {seats.map((s, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="座席タイプ（例：個室、カウンター）"
            value={s.type}
            onChange={(e) => {
              const x = [...seats];
              x[i].type = e.target.value;
              setSeats(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="数（例：5）"
            value={s.count}
            onChange={(e) => {
              const x = [...seats];
              x[i].count = e.target.value;
              setSeats(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setSeats([...seats, { type: '', count: '' }])}
      >
        + 座席タイプ追加
      </button>

      {/* コース料理設定 */}
      <h2 className="text-lg font-semibold mb-2">料理コース設定</h2>
      {courses.map((c, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="コース名"
            value={c.name}
            onChange={(e) => {
              const x = [...courses];
              x[i].name = e.target.value;
              setCourses(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="料金（円）"
            value={c.price}
            onChange={(e) => {
              const x = [...courses];
              x[i].price = e.target.value;
              setCourses(x);
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={c.preOrder}
              onChange={(e) => {
                const x = [...courses];
                x[i].preOrder = e.target.checked;
                setCourses(x);
              }}
            />{' '}
            予約時の事前注文を許可する
          </label>
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setCourses([...courses, { name: '', price: '', preOrder: false }])}
      >
        + コース追加
      </button>

      {/* 最大予約人数 */}
      <h2 className="text-lg font-semibold mb-2">最大予約人数</h2>
      <input
        type="number"
        className="border p-1 w-full mb-4"
        value={maxGuests}
        onChange={(e) => setMaxGuests(Number(e.target.value))}
        placeholder="最大人数（例：10）"
      />

      {/* キャンセルポリシー */}
      <h2 className="text-lg font-semibold mb-2">キャンセルポリシー・料金設定</h2>
      <textarea
        className="border p-2 w-full h-24"
        placeholder="キャンセルポリシーを入力"
        value={cancelPolicy}
        onChange={(e) => setCancelPolicy(e.target.value)}
      />

      {/* 保存ボタン */}
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          保存
        </button>
      </div>
    </div>
  );
}

