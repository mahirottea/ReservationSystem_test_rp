'use client';

import { useSidebar } from '@/app/context/AdminSidebarContext';

export default function AdminPageHeader({ title }: { title: string }) {
  const { toggle } = useSidebar();
  return (
    <div className="flex items-center gap-4 mb-4">
      <button onClick={toggle} className="p-2 bg-gray-800 text-white rounded">☰</button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
