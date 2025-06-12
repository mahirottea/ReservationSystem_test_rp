'use client';
import RoleGuard from "@/components/RoleGuard";

export default function UserHome() {
  return (
    <RoleGuard allowedRoles={["user"]}>
      <main>
        <h1>ユーザーホーム</h1>
        {/* ユーザー機能 */}
      </main>
    </RoleGuard>
  );
}
