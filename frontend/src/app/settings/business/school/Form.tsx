'use client';

import { useState } from 'react';

export default function SchoolForm({ formData, setFormData }: any) {
  const [lessons, setLessons] = useState(formData.lessons || []);
  const [instructors, setInstructors] = useState(formData.instructors || []);
  const [billingType, setBillingType] = useState(formData.billingType || 'monthly');
  const [allowMakeup, setAllowMakeup] = useState(formData.allowMakeup || false);

  const updateLesson = (index: number, key: string, value: any) => {
    const newLessons = [...lessons];
    newLessons[index][key] = value;
    setLessons(newLessons);
    setFormData({ ...formData, lessons: newLessons });
  };

  const addLesson = () => {
    const newLessons = [...lessons, { name: '', day: '', time: '' }];
    setLessons(newLessons);
    setFormData({ ...formData, lessons: newLessons });
  };

  const updateInstructor = (index: number, key: string, value: any) => {
    const newInstructors = [...instructors];
    newInstructors[index][key] = value;
    setInstructors(newInstructors);
    setFormData({ ...formData, instructors: newInstructors });
  };

  const addInstructor = () => {
    const newInstructors = [...instructors, { name: '', subjects: '' }];
    setInstructors(newInstructors);
    setFormData({ ...formData, instructors: newInstructors });
  };

  const changeBillingType = (type: 'monthly' | 'ticket') => {
    setBillingType(type);
    setFormData({ ...formData, billingType: type });
  };

  const toggleMakeup = () => {
    const updated = !allowMakeup;
    setAllowMakeup(updated);
    setFormData({ ...formData, allowMakeup: updated });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold mb-2">レッスン登録</h2>
        {lessons.map((lesson: any, i: number) => (
          <div key={i} className="mb-2 space-y-1 border p-3 rounded">
            <input
              type="text"
              placeholder="レッスン名"
              className="border p-2 w-full"
              value={lesson.name}
              onChange={(e) => updateLesson(i, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="曜日"
              className="border p-2 w-full"
              value={lesson.day}
              onChange={(e) => updateLesson(i, 'day', e.target.value)}
            />
            <input
              type="text"
              placeholder="時間帯（例：17:00〜18:00）"
              className="border p-2 w-full"
              value={lesson.time}
              onChange={(e) => updateLesson(i, 'time', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addLesson}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + レッスン追加
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">講師登録</h2>
        {instructors.map((inst: any, i: number) => (
          <div key={i} className="mb-2 space-y-1 border p-3 rounded">
            <input
              type="text"
              placeholder="講師名"
              className="border p-2 w-full"
              value={inst.name}
              onChange={(e) => updateInstructor(i, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="担当教科（例：英語、ピアノ）"
              className="border p-2 w-full"
              value={inst.subjects}
              onChange={(e) => updateInstructor(i, 'subjects', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addInstructor}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 講師追加
        </button>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">課金形態</h2>
        <label className="mr-4">
          <input
            type="radio"
            name="billingType"
            value="monthly"
            checked={billingType === 'monthly'}
            onChange={() => changeBillingType('monthly')}
            className="mr-2"
          />
          月謝制
        </label>
        <label>
          <input
            type="radio"
            name="billingType"
            value="ticket"
            checked={billingType === 'ticket'}
            onChange={() => changeBillingType('ticket')}
            className="mr-2"
          />
          チケット制
        </label>
      </section>

      <section>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={allowMakeup}
            onChange={toggleMakeup}
          />
          振替予約を許可する
        </label>
      </section>
    </div>
  );
}
