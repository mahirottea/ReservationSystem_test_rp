'use client';

import { useState, useEffect } from 'react';
import { saveSetting } from '@/lib/api/saveSetting';
import { useRouter } from 'next/navigation';
import type { EventSettingData } from '@/types/business';

type Props = {
  onChange?: (data: EventSettingData) => void;
};

export default function EventSettingPage({ onChange }: Props) {

  const router = useRouter();
  const [events, setEvents] = useState([{ title: '', date: '', location: '', capacity: '' }]);
  const [tickets, setTickets] = useState([{ type: '', price: '', quantity: '' }]);
  const [enablePayment, setEnablePayment] = useState(true);
  const [enableWaitlist, setEnableWaitlist] = useState(false);

  useEffect(() => {
    onChange?.({ events, tickets, enablePayment, enableWaitlist });
  }, [events, tickets, enablePayment, enableWaitlist]);

  const handleSubmit = async () => {
    const payload = {
      type: 'event',
      events,
      tickets,
      enablePayment,
      enableWaitlist,
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
      <h1 className="text-2xl font-bold mb-6">イベント・セミナー 専用設定</h1>

      {/* イベント情報 */}
      <h2 className="text-lg font-semibold mb-2">イベント登録</h2>
      {events.map((ev, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="イベント名"
            value={ev.title}
            onChange={(e) => {
              const x = [...events];
              x[i].title = e.target.value;
              setEvents(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            type="date"
            value={ev.date}
            onChange={(e) => {
              const x = [...events];
              x[i].date = e.target.value;
              setEvents(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="会場名（例：○○ホール）"
            value={ev.location}
            onChange={(e) => {
              const x = [...events];
              x[i].location = e.target.value;
              setEvents(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="定員"
            value={ev.capacity}
            onChange={(e) => {
              const x = [...events];
              x[i].capacity = e.target.value;
              setEvents(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setEvents([...events, { title: '', date: '', location: '', capacity: '' }])}
      >
        + イベント追加
      </button>

      {/* チケット設定 */}
      <h2 className="text-lg font-semibold mb-2">チケット設定</h2>
      {tickets.map((t, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="チケット種別（例：一般、学生）"
            value={t.type}
            onChange={(e) => {
              const x = [...tickets];
              x[i].type = e.target.value;
              setTickets(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="料金（円）"
            value={t.price}
            onChange={(e) => {
              const x = [...tickets];
              x[i].price = e.target.value;
              setTickets(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="発行枚数"
            value={t.quantity}
            onChange={(e) => {
              const x = [...tickets];
              x[i].quantity = e.target.value;
              setTickets(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setTickets([...tickets, { type: '', price: '', quantity: '' }])}
      >
        + チケット追加
      </button>

      {/* 決済設定 */}
      <h2 className="text-lg font-semibold mb-2">事前決済設定</h2>
      <label>
        <input
          type="checkbox"
          checked={enablePayment}
          onChange={(e) => setEnablePayment(e.target.checked)}
        />{' '}
        Stripe等のオンライン決済を有効にする
      </label>

      {/* キャンセル待ち */}
      <h2 className="text-lg font-semibold mt-4 mb-2">キャンセル待ち受付</h2>
      <label>
        <input
          type="checkbox"
          checked={enableWaitlist}
          onChange={(e) => setEnableWaitlist(e.target.checked)}
        />{' '}
        定員超過時にキャンセル待ちを受け付ける
      </label>

      {/* 保存 */}
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
