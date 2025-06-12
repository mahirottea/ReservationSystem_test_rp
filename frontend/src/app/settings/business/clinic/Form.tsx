'use client';

import { useState } from 'react';

export default function ClinicForm({ formData, setFormData }: any) {
  const [menus, setMenus] = useState(formData.menus || []);
  const [questions, setQuestions] = useState(formData.questions || []);
  const [nextVisitEnabled, setNextVisitEnabled] = useState(formData.nextVisitEnabled || false);

  const updateMenu = (index: number, key: string, value: any) => {
    const newMenus = [...menus];
    newMenus[index][key] = value;
    setMenus(newMenus);
    setFormData({ ...formData, menus: newMenus });
  };

  const addMenu = () => {
    const newMenu = { name: '', duration: '', insurance: false };
    const newMenus = [...menus, newMenu];
    setMenus(newMenus);
    setFormData({ ...formData, menus: newMenus });
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestions = [...questions, ''];
    setQuestions(newQuestions);
    setFormData({ ...formData, questions: newQuestions });
  };

  const toggleNextVisit = () => {
    const newValue = !nextVisitEnabled;
    setNextVisitEnabled(newValue);
    setFormData({ ...formData, nextVisitEnabled: newValue });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-bold text-lg mb-2">診療メニュー設定</h2>
        {menus.map((menu: any, index: number) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <input
              type="text"
              placeholder="メニュー名"
              className="border p-2 mb-2 w-full"
              value={menu.name}
              onChange={(e) => updateMenu(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="所要時間（分）"
              className="border p-2 mb-2 w-full"
              value={menu.duration}
              onChange={(e) => updateMenu(index, 'duration', Number(e.target.value))}
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={menu.insurance}
                onChange={(e) => updateMenu(index, 'insurance', e.target.checked)}
              />
              保険適用
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addMenu}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + 診療メニュー追加
        </button>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-2">問診票フォーム</h2>
        {questions.map(( q: any, i: any) => (
          <input
            key={i}
            type="text"
            placeholder="質問項目"
            className="border p-2 mb-2 w-full"
            value={q}
            onChange={(e) => updateQuestion(i, e.target.value)}
          />
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + 質問追加
        </button>
      </section>

      <section>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={nextVisitEnabled}
            onChange={toggleNextVisit}
          />
          再診予約を許可（定期検診案内など）
        </label>
      </section>
    </div>
  );
}
