'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Questionnaire {
  id: string;
  question: string;
}

export default function QuestionnaireListPage() {
  const [items, setItems] = useState<Questionnaire[]>([]);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    apiClient
      .get('/questionnaires', { params: { tenantId } })
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <AdminPageHeader title="問診票一覧" />
          <Link href="/admin/questionnaires/new" className="px-3 py-1 rounded bg-blue-600 text-white">
            新規作成
          </Link>
        </div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">質問</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="p-2 border">{q.question}</td>
                <td className="p-2 border">
                  <Link href={`/admin/questionnaires/${q.id}/edit`} className="text-blue-600 hover:underline">
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={2} className="p-2 border text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
