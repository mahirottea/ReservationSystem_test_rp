'use client';
import RoleGuard from "@/components/RoleGuard";

export default function UserHome() {
  return (
    <RoleGuard allowedRoles={["user"]}>
      <main>
        <h1>ユーザーホーム</h1>
        <ul className="mt-4 space-y-2">
          <li>
            <a href="/user/calendar" className="text-blue-600 underline">
              予約カレンダー
            </a>
          </li>
        </ul>
      </main>
    </RoleGuard>
  );
}
