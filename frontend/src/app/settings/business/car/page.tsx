'use client';

import { useState, useEffect } from 'react';
import { saveSetting } from '@/lib/api/saveSetting';
import { useRouter } from 'next/navigation';
import type { CarSettingData } from '@/types/business';

type Props = {
  onChange?: (data: CarSettingData) => void;
};

export default function CarSettingPage({ onChange }: Props) {

  const router = useRouter();
  const [items, setItems] = useState([{ name: '', type: '', stock: '' }]);
  const [deposit, setDeposit] = useState(0);
  const [lateFee, setLateFee] = useState('');
  const [useInventory, setUseInventory] = useState(true);

  useEffect(() => {
    onChange?.({ items, deposit, lateFee, useInventory });
  }, [items, deposit, lateFee, useInventory]);

  const handleSubmit = async () => {
    const payload = {
      type: 'car',
      items,
      deposit,
      lateFee,
      useInventory,
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
      <h1 className="text-2xl font-bold mb-6">レンタカー・設備レンタル 専用設定</h1>

      {/* 商品登録 */}
      <h2 className="text-lg font-semibold mb-2">商品登録</h2>
      {items.map((item, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="商品名"
            value={item.name}
            onChange={(e) => {
              const x = [...items];
              x[i].name = e.target.value;
              setItems(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="タイプ"
            value={item.type}
            onChange={(e) => {
              const x = [...items];
              x[i].type = e.target.value;
              setItems(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="在庫数"
            value={item.stock}
            onChange={(e) => {
              const x = [...items];
              x[i].stock = e.target.value;
              setItems(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setItems([...items, { name: '', type: '', stock: '' }])}
      >
        + 商品追加
      </button>

      {/* 保証金 */}
      <h2 className="text-lg font-semibold mb-2">保証金設定</h2>
      <input
        className="border p-1 w-full mb-4"
        type="number"
        placeholder="保証金（円）"
        value={deposit}
        onChange={(e) => setDeposit(Number(e.target.value))}
      />

      {/* 延滞料金 */}
      <h2 className="text-lg font-semibold mb-2">延滞料金設定</h2>
      <input
        className="border p-1 w-full mb-4"
        placeholder="延滞料金の説明（例：1時間ごとに500円）"
        value={lateFee}
        onChange={(e) => setLateFee(e.target.value)}
      />

      {/* 在庫管理 */}
      <h2 className="text-lg font-semibold mb-2">在庫管理</h2>
      <label>
        <input
          type="checkbox"
          checked={useInventory}
          onChange={(e) => setUseInventory(e.target.checked)}
        />{' '}
        在庫制限を有効にする
      </label>

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
