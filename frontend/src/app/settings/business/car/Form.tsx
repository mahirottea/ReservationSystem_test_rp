'use client';

import { useState } from 'react';

export default function CarForm({ formData, setFormData }: any) {
  const [items, setItems] = useState(formData.items || []);

  const updateItem = (index: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newItem = { name: '', description: '', price: '', stock: 1 };
    const newItems = [...items, newItem];
    setItems(newItems);
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">商品（レンタル設備）登録</h2>
      {items.map((item: any, index: number) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <input
            type="text"
            placeholder="商品名"
            className="border p-2 mb-2 w-full"
            value={item.name}
            onChange={(e) => updateItem(index, 'name', e.target.value)}
          />
          <input
            type="text"
            placeholder="説明文"
            className="border p-2 mb-2 w-full"
            value={item.description}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
          />
          <input
            type="number"
            placeholder="料金（時間単位）"
            className="border p-2 mb-2 w-full"
            value={item.price}
            onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
          />
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
    </div>
  );
}
