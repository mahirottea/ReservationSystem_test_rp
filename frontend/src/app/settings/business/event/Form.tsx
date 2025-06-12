'use client';

import { useState } from 'react';

export default function EventForm({ formData, setFormData }: any) {
  const [events, setEvents] = useState(formData.events || []);
  const [acceptWait, setAcceptWait] = useState(formData.acceptWait || false);

  const updateEvent = (index: number, key: string, value: any) => {
    const updated = [...events];
    updated[index][key] = value;
    setEvents(updated);
    setFormData({ ...formData, events: updated });
  };

  const addEvent = () => {
    const newItem = { name: '', date: '', capacity: 0, ticket: { type: '', price: 0 } };
    const updated = [...events, newItem];
    setEvents(updated);
    setFormData({ ...formData, events: updated });
  };

  const toggleWait = () => {
    const newValue = !acceptWait;
    setAcceptWait(newValue);
    setFormData({ ...formData, acceptWait: newValue });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-bold text-lg mb-2">イベント登録</h2>
        {events.map((ev: any, i: number) => (
          <div key={i} className="mb-4 border p-4 rounded space-y-2">
            <input
              type="text"
              placeholder="イベント名"
              className="border p-2 w-full"
              value={ev.name}
              onChange={(e) => updateEvent(i, 'name', e.target.value)}
            />
            <input
              type="date"
              placeholder="開催日"
              className="border p-2 w-full"
              value={ev.date}
              onChange={(e) => updateEvent(i, 'date', e.target.value)}
            />
            <input
              type="number"
              placeholder="定員"
              className="border p-2 w-full"
              value={ev.capacity}
              onChange={(e) => updateEvent(i, 'capacity', Number(e.target.value))}
            />
            <div className="space-y-2">
              <input
                type="text"
                placeholder="チケット種別"
                className="border p-2 w-full"
                value={ev.ticket?.type || ''}
                onChange={(e) =>
                  updateEvent(i, 'ticket', {
                    ...ev.ticket,
                    type: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="チケット料金（円）"
                className="border p-2 w-full"
                value={ev.ticket?.price || ''}
                onChange={(e) =>
                  updateEvent(i, 'ticket', {
                    ...ev.ticket,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + イベント追加
        </button>
      </section>

      <section>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={acceptWait}
            onChange={toggleWait}
          />
          キャンセル待ちを許可する
        </label>
      </section>
    </div>
  );
}
