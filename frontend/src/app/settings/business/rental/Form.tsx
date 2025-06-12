'use client';

import { useState } from 'react';

export default function RentalForm({ formData, setFormData }: any) {
  const [items, setItems] = useState(formData.items || []);
  const [requireDeposit, setRequireDeposit] = useState(formData.requireDeposit || false);
  const [returnFee, setReturnFee] = useState(formData.returnFee || 0);

  const updateItem = (index: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newItem = { name: '', price: '', unit: '時間', stock: 1 };
    const newItems = [...items, newItem];
    setItems(newItems);
    setFormData({ ...formData, items: newItems });
  };

  const handleDepositToggle = () => {
    const updated = !requireDeposit;
    setRequireDeposit(updated);
    setFormData({ ...formData, requireDeposit: updated });
  };

  const handleReturnFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fee = Number(e.target.value);
    setReturnFee(fee);
    setFormData({ ...formData, returnFee: fee });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-bold text-lg mb-2">レンタル商品登録</h2>
        {items.map((item: any, index: number) => (
          <div key={index} className="mb-4 border p-4 rounded space-y-2">
            <input
              type="text"
              placeholder="商品名"
              className="border p-2 w-full"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="料金"
              className="border p-2 w-full"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
            />
            <select
              className="border p-2 w-full"
              value={item.unit}
              onChange={(e) => updateItem(index, 'unit', e.target.value)}
            >
              <option value="時間">時間</option>
              <option value="日">日</option>
            </select>
            <input
              type="number"
              placeholder="在庫数"
              className="border p-2 w-full"
              value={item.stock}
              onChange={(e) => updateItem(index, 'stock', Number(e.target.value))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + 商品追加
        </button>
      </section>

      <section>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={requireDeposit}
            onChange={handleDepositToggle}
          />
          保証金を必要とする
        </label>
      </section>

      <section>
        <h2 className="font-bold text-base mb-2">返却遅延料金</h2>
        <input
          type="number"
          placeholder="返却遅延料金（円）"
          className="border p-2 w-full"
          value={returnFee}
          onChange={handleReturnFeeChange}
        />
      </section>
    </div>
  );
}
