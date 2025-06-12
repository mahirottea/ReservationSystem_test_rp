'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../app/context/AdminSidebarContext';
import { useEffect, useRef, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('tenantId');
      if (id) setTenantId(id);
    }
  }, []);

  const isActive = (path: string) => pathname.startsWith(path);

  // 背景クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggle(); // メニューを閉じる
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggle]);

  return (
    <div className="relative flex">
      {/* サイドメニュー */}
      {isOpen && (
        <div
          ref={menuRef}
            className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-lg z-50 p-6 flex flex-col justify-between
            transform transition-transform duration-500 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
          <div>
            <h2 className="text-xl font-bold mb-6">管理メニュー</h2>
            <ul className="space-y-4 text-lg font-semibold">
              <li>
                <Link href="/admin/dashboard" className={isActive('/admin/dashboard') ? 'underline' : ''}>
                  🏠 ダッシュボード
                </Link>
              </li>
              <li>
                <Link href="/admin/calendar" className={isActive('/admin/calendar') ? 'underline' : ''}>
                  📅 予約確認
                </Link>
              </li>
              <li>
                <Link href="/admin/reservations" className={isActive('/admin/reservations') ? 'underline' : ''}>
                  📝 予約管理
                </Link>
              </li>
              <li>
                <Link href="/admin/customers/list" className={isActive('/admin/customers') ? 'underline' : ''}>
                  👥 顧客管理
                </Link>
              </li>
              <li>
                <Link href="/admin/staff/list" className={isActive('/admin/staff') ? 'underline' : ''}>
                  🧑‍💼 スタッフ管理
                </Link>
              </li>
              <li>
                <Link href="/admin/services/list" className={isActive('/admin/services') ? 'underline' : ''}>
                  🛠️ メニュー管理
                </Link>
              </li>
              <li>
                <Link href="/admin/coupons" className={isActive('/admin/coupons') ? 'underline' : ''}>
                  🎟️ クーポン
                </Link>
              </li>
              <li>
                <Link href="/admin/questionnaires/list" className={isActive('/admin/questionnaires') ? 'underline' : ''}>
                  📑 問診票
                </Link>
              </li>
              <li>
                <Link href="/admin/timeslot-prices/list" className={isActive('/admin/timeslot-prices') ? 'underline' : ''}>
                  🕒 料金設定
                </Link>
              </li>
              <li>
                <Link href="/admin/seat-types/list" className={isActive('/admin/seat-types') ? 'underline' : ''}>
                  💺 席タイプ
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className={isActive('/admin/analytics') ? 'underline' : ''}>
                  📊 分析
                </Link>
              </li>
              <li>
                <Link href="/admin/sales" className={isActive('/admin/sales') ? 'underline' : ''}>
                  💰 売上管理
                </Link>
              </li>
              <li>
                <Link
                  href={`/admin/settings/${tenantId || 'uuid'}/edit`}
                  className={isActive('/admin/settings') ? 'underline' : ''}
                >
                  ⚙️ 設定
                </Link>
              </li>
            </ul>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={toggle}
            className="mt-6 px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 text-sm"
          >
            メニューを閉じる
          </button>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
