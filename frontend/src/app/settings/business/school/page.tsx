'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveSetting } from '@/lib/api/saveSetting';
import type { SchoolSettingData } from '@/types/business';

type Props = {
  onChange?: (data: SchoolSettingData) => void;
};

export default function SchoolSettingPage({ onChange }: Props) {
  const router = useRouter();

  const [lessons, setLessons] = useState([{ name: '', day: '', time: '' }]);
  const [instructors, setInstructors] = useState([{ name: '', subjects: '' }]);
  const [billingType, setBillingType] = useState<'monthly' | 'ticket'>('monthly');
  const [allowMakeup, setAllowMakeup] = useState(true);

  useEffect(() => {
    onChange?.({ lessons, instructors, billingType, allowMakeup });
  }, [lessons, instructors, billingType, allowMakeup]);

  const handleSubmit = async () => {
    const payload = {
      type: 'school',
      lessons,
      instructors,
      billingType,
      allowMakeup,
    };

    try {
      const res = await saveSetting(payload);
      router.push('/settings/complete'); // ✅ 完了画面に遷移
    } catch (e) {
      alert('保存に失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">スクール・習い事 専用設定</h1>

      {/* レッスン登録 */}
      <h2 className="text-lg font-semibold mb-2">レッスン登録</h2>
      {lessons.map((l, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="レッスン名"
            value={l.name}
            onChange={(e) => {
              const x = [...lessons];
              x[i].name = e.target.value;
              setLessons(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="曜日"
            value={l.day}
            onChange={(e) => {
              const x = [...lessons];
              x[i].day = e.target.value;
              setLessons(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="時間（例：17:00〜18:00）"
            value={l.time}
            onChange={(e) => {
              const x = [...lessons];
              x[i].time = e.target.value;
              setLessons(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() =>
          setLessons([...lessons, { name: '', day: '', time: '' }])
        }
      >
        + レッスン追加
      </button>

      {/* 講師登録 */}
      <h2 className="text-lg font-semibold mb-2">講師登録</h2>
      {instructors.map((t, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="講師名"
            value={t.name}
            onChange={(e) => {
              const x = [...instructors];
              x[i].name = e.target.value;
              setInstructors(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="担当教科（例：英語、ピアノ）"
            value={t.subjects}
            onChange={(e) => {
              const x = [...instructors];
              x[i].subjects = e.target.value;
              setInstructors(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() =>
          setInstructors([...instructors, { name: '', subjects: '' }])
        }
      >
        + 講師追加
      </button>

      {/* 課金形態 */}
      <h2 className="text-lg font-semibold mb-2">課金形態</h2>
      <label className="mr-4">
        <input
          type="radio"
          name="billing"
          value="monthly"
          checked={billingType === 'monthly'}
          onChange={() => setBillingType('monthly')}
        />{' '}
        月謝制
      </label>
      <label>
        <input
          type="radio"
          name="billing"
          value="ticket"
          checked={billingType === 'ticket'}
          onChange={() => setBillingType('ticket')}
        />{' '}
        チケット制
      </label>

      {/* 振替予約 */}
      <h2 className="text-lg font-semibold mt-4 mb-2">振替予約設定</h2>
      <label>
        <input
          type="checkbox"
          checked={allowMakeup}
          onChange={(e) => setAllowMakeup(e.target.checked)}
        />{' '}
        欠席時の振替予約を許可する
      </label>

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
