'use client';

import { useState, useEffect } from 'react';
import { saveSetting } from '@/lib/api/saveSetting';
import { useRouter } from 'next/navigation';
import type { ClinicSettingData } from '@/types/business';

type Props = {
  onChange?: (data: ClinicSettingData) => void;
};

export default function ClinicSettingPage({ onChange }: Props) {

  const router = useRouter();
  const [staffList, setStaffList] = useState([
    { name: '', department: '', schedule: '' },
  ]);
  const [menus, setMenus] = useState([
    { name: '', time: '', insured: false },
  ]);
  const [questions, setQuestions] = useState(['']);
  const [followup, setFollowup] = useState('');

  useEffect(() => {
    onChange?.({ staffList, menus, questions, followup });
  }, [staffList, menus, questions, followup]);

  const handleSubmit = async () => {
    const payload = {
      type: 'clinic',
      staffList,
      menus,
      questions,
      followup,
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
      <h1 className="text-2xl font-bold mb-6">医療・クリニック 専用設定</h1>

      {/* 医師・スタッフ登録 */}
      <h2 className="text-lg font-semibold mb-2">担当医師・スタッフ登録</h2>
      {staffList.map((s, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="医師名"
            value={s.name}
            onChange={(e) => {
              const x = [...staffList];
              x[i].name = e.target.value;
              setStaffList(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="診療科目"
            value={s.department}
            onChange={(e) => {
              const x = [...staffList];
              x[i].department = e.target.value;
              setStaffList(x);
            }}
          />
          <input
            className="border p-1 w-full"
            placeholder="勤務スケジュール"
            value={s.schedule}
            onChange={(e) => {
              const x = [...staffList];
              x[i].schedule = e.target.value;
              setStaffList(x);
            }}
          />
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() =>
          setStaffList([...staffList, { name: '', department: '', schedule: '' }])
        }
      >
        + 医師/スタッフ追加
      </button>

      {/* 診療メニュー設定 */}
      <h2 className="text-lg font-semibold mb-2">診療メニュー設定</h2>
      {menus.map((m, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            className="border p-1 w-full mb-1"
            placeholder="メニュー名"
            value={m.name}
            onChange={(e) => {
              const x = [...menus];
              x[i].name = e.target.value;
              setMenus(x);
            }}
          />
          <input
            className="border p-1 w-full mb-1"
            placeholder="所要時間"
            value={m.time}
            onChange={(e) => {
              const x = [...menus];
              x[i].time = e.target.value;
              setMenus(x);
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={m.insured}
              onChange={(e) => {
                const x = [...menus];
                x[i].insured = e.target.checked;
                setMenus(x);
              }}
            />{' '}
            保険適用
          </label>
        </div>
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setMenus([...menus, { name: '', time: '', insured: false }])}
      >
        + 診療メニュー追加
      </button>

      {/* 問診票設定 */}
      <h2 className="text-lg font-semibold mb-2">問診票フォーム項目</h2>
      {questions.map((q, i) => (
        <input
          key={i}
          className="border p-1 w-full mb-1"
          placeholder="問診項目"
          value={q}
          onChange={(e) => {
            const x = [...questions];
            x[i] = e.target.value;
            setQuestions(x);
          }}
        />
      ))}
      <button
        className="mb-4 bg-gray-300 px-2 py-1"
        onClick={() => setQuestions([...questions, ''])}
      >
        + 項目追加
      </button>

      {/* 再診予約設定 */}
      <h2 className="text-lg font-semibold mb-2">再診予約設定</h2>
      <input
        className="border p-1 w-full mb-4"
        placeholder="定期検診案内文（任意）"
        value={followup}
        onChange={(e) => setFollowup(e.target.value)}
      />

      {/* 保存 */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit}
      >
        保存
      </button>
    </div>
  );
}
