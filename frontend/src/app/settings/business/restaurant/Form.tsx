'use client';

import { useState } from 'react';

export default function RestaurantForm({ formData, setFormData }: any) {
  const [seats, setSeats] = useState(formData.seats || []);
  const [courses, setCourses] = useState(formData.courses || []);
  const [maxGuests, setMaxGuests] = useState(formData.maxGuests || 0);
  const [cancelPolicy, setCancelPolicy] = useState(formData.cancelPolicy || '');

  const updateSeat = (index: number, key: string, value: any) => {
    const newSeats = [...seats];
    newSeats[index][key] = value;
    setSeats(newSeats);
    setFormData({ ...formData, seats: newSeats });
  };

  const addSeat = () => {
    const newSeats = [...seats, { type: '', count: 0 }];
    setSeats(newSeats);
    setFormData({ ...formData, seats: newSeats });
  };

  const updateCourse = (index: number, key: string, value: any) => {
    const newCourses = [...courses];
    newCourses[index][key] = value;
    setCourses(newCourses);
    setFormData({ ...formData, courses: newCourses });
  };

  const addCourse = () => {
    const newCourses = [...courses, { name: '', price: '', preOrder: false }];
    setCourses(newCourses);
    setFormData({ ...formData, courses: newCourses });
  };

  const handleMaxGuestsChange = (e: any) => {
    const value = Number(e.target.value);
    setMaxGuests(value);
    setFormData({ ...formData, maxGuests: value });
  };

  const handleCancelPolicyChange = (e: any) => {
    const value = e.target.value;
    setCancelPolicy(value);
    setFormData({ ...formData, cancelPolicy: value });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold mb-2">席数登録</h2>
        {seats.map((seat: any, i: number) => (
          <div key={i} className="mb-2 space-y-1 border p-3 rounded">
            <input
              type="text"
              placeholder="席種別（例：カウンター、テーブル）"
              className="border p-2 w-full"
              value={seat.type}
              onChange={(e) => updateSeat(i, 'type', e.target.value)}
            />
            <input
              type="number"
              placeholder="数"
              className="border p-2 w-full"
              value={seat.count}
              onChange={(e) => updateSeat(i, 'count', Number(e.target.value))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSeat}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 席を追加
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">コース登録</h2>
        {courses.map((c: any, i: number) => (
          <div key={i} className="mb-2 space-y-1 border p-3 rounded">
            <input
              type="text"
              placeholder="コース名"
              className="border p-2 w-full"
              value={c.name}
              onChange={(e) => updateCourse(i, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="価格"
              className="border p-2 w-full"
              value={c.price}
              onChange={(e) => updateCourse(i, 'price', Number(e.target.value))}
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={c.preOrder}
                onChange={(e) => updateCourse(i, 'preOrder', e.target.checked)}
              />
              事前予約制
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + コース追加
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">最大予約人数</h2>
        <input
          type="number"
          placeholder="最大人数"
          className="border p-2 w-full"
          value={maxGuests}
          onChange={handleMaxGuestsChange}
        />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">キャンセルポリシー</h2>
        <textarea
          placeholder="キャンセルポリシー内容"
          className="border p-2 w-full"
          rows={3}
          value={cancelPolicy}
          onChange={handleCancelPolicyChange}
        />
      </section>
    </div>
  );
}
