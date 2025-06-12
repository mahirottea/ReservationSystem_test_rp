'use client';

import { useState, useEffect } from 'react';
import { saveSetting } from '@/lib/api/saveSetting';
import { useRouter } from 'next/navigation';
import type { RentalSettingData } from '@/types/business';

type Props = {
  onChange?: (data: RentalSettingData) => void;
};

export default function RentalSettingPage({ onChange }: Props) {
  const router = useRouter();
  const [rooms, setRooms] = useState([{ name: '', capacity: '', facilities: '' }]);
  const [pricing, setPricing] = useState([{ day: '', time: '', price: '' }]);
  const [options, setOptions] = useState([{ name: '', price: '', available: true }]);
  const [allowChain, setAllowChain] = useState(true);

  useEffect(() => {
    onChange?.({ rooms, pricing, options, allowChain });
  }, [rooms, pricing, options, allowChain]);

  const handleSubmit = async () => {
    const payload = {
      type: 'rental',
      rooms,
      pricing,
      options,
      allowChain,
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
      <h1 className="text-2xl font-bold mb-6">会議室・レンタルスペース 専用設定</h1>

      {/* 会議室登録 */}
      <h2 className="text-lg font-semibold mb-2">スペース登録</h2>
      {rooms.map((r, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="スペース名"
            value={r.name}
            onChange={(e) => {
              const x = [...rooms];
              x[i].name = e.target.value;
              setRooms(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="定員"
            value={r.capacity}
            onChange={(e) => {
              const x = [...rooms];
              x[i].capacity = e.target.value;
              setRooms(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="備品・設備（例：ホワイトボード）"
            value={r.facilities}
            onChange={(e) => {
              const x = [...rooms];
              x[i].facilities = e.target.value;
              setRooms(x);
            }}
          />
        </div>
      ))}
      <button className="mb-4 bg-gray-300 px-2 py-1" onClick={() => setRooms([...rooms, { name: '', capacity: '', facilities: '' }])}>
        + スペース追加
      </button>

      {/* 料金設定 */}
      <h2 className="text-lg font-semibold mb-2">料金設定</h2>
      {pricing.map((p, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="曜日（例：平日）"
            value={p.day}
            onChange={(e) => {
              const x = [...pricing];
              x[i].day = e.target.value;
              setPricing(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="時間帯（例：9:00〜12:00）"
            value={p.time}
            onChange={(e) => {
              const x = [...pricing];
              x[i].time = e.target.value;
              setPricing(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="料金（円）"
            value={p.price}
            onChange={(e) => {
              const x = [...pricing];
              x[i].price = e.target.value;
              setPricing(x);
            }}
          />
        </div>
      ))}
      <button className="mb-4 bg-gray-300 px-2 py-1" onClick={() => setPricing([...pricing, { day: '', time: '', price: '' }])}>
        + 時間帯追加
      </button>

      {/* 備品オプション */}
      <h2 className="text-lg font-semibold mb-2">備品オプション</h2>
      {options.map((o, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="備品名"
            value={o.name}
            onChange={(e) => {
              const x = [...options];
              x[i].name = e.target.value;
              setOptions(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="料金（円）"
            value={o.price}
            onChange={(e) => {
              const x = [...options];
              x[i].price = e.target.value;
              setOptions(x);
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={o.available}
              onChange={(e) => {
                const x = [...options];
                x[i].available = e.target.checked;
                setOptions(x);
              }}
            />{' '}
            利用可能
          </label>
        </div>
      ))}
      <button className="mb-4 bg-gray-300 px-2 py-1" onClick={() => setOptions([...options, { name: '', price: '', available: true }])}>
        + 備品追加
      </button>

      {/* 連続予約 */}
      <h2 className="text-lg font-semibold mb-2">連続予約設定</h2>
      <label>
        <input
          type="checkbox"
          checked={allowChain}
          onChange={(e) => setAllowChain(e.target.checked)}
        />{' '}
        連続予約を許可する
      </label>

      {/* 保存ボタン */}
      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>
          保存
        </button>
      </div>
    </div>
  );
}
