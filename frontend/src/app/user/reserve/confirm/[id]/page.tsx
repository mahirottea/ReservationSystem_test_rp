'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import getReservationById from '@/lib/api/getReservationById';

export default function ReservationConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    getReservationById(id).then(setReservation).catch(console.error);
  }, [id]);

  return (
    <RoleGuard allowedRoles={['user']}>
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">予約完了</h1>
        {reservation ? (
          <div className="space-y-2">
            <p>日時: {new Date(reservation.date).toLocaleString()}</p>
            <p>担当: {reservation.staff?.name}</p>
            <p>
              サービス: {reservation.reservationItems.map((i: any) => i.service?.name).join('・')}
            </p>
            <p>ステータス: {reservation.status}</p>
          </div>
        ) : (
          <p>読み込み中...</p>
        )}
      </main>
    </RoleGuard>
  );
}
