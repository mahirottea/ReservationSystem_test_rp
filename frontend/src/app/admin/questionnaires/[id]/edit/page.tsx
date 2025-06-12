'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

interface Questionnaire {
  id: string;
  question: string;
}

export default function QuestionnaireEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (!id) return;
    apiClient
      .get(`/questionnaires/${id}`)
      .then((res) => {
        const data: Questionnaire = res.data;
        setQuestion(data.question);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    await apiClient.put(`/questionnaires/${id}`, { question });
    router.push('/admin/questionnaires/list');
  };

  const handleDelete = async () => {
    if (!id) return;
    await apiClient.delete(`/questionnaires/${id}`);
    router.push('/admin/questionnaires/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="問診票編集" />
        <input
          className="border p-2 w-full"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="space-x-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
            更新
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
            削除
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
