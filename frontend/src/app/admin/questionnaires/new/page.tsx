'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminSidebar';
import AdminPageHeader from '@/components/AdminPageHeader';
import apiClient from '@/lib/apiClient';

export default function QuestionnaireNewPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');

  const handleSave = async () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    await apiClient.post('/questionnaires', { question, tenantId });
    router.push('/admin/questionnaires/list');
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="問診票新規作成" />
        <input
          className="border p-2 w-full"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問"
        />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
          保存
        </button>
      </div>
    </AdminLayout>
  );
}
