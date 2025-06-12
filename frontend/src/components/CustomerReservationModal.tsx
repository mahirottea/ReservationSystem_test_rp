'use client';
import React from 'react';

export default function CustomerReservationModal(props: any) {
  if (!props.isOpen) return null;

  const {
    onClose,
    onSave,
    onDelete,
    reservationId,
    data,
  } = props;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg relative">
        <h2 className="text-xl font-bold mb-4">予約</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-3"
        >
          {/* 氏名 */}
          <div>
            <label className="block text-sm font-medium">氏名</label>
            <input
              type="text"
              value={data.name ?? ''}
              onChange={(e) => data.setName(e.target.value)}
              required
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* メール */}
          <div>
            <label className="block text-sm font-medium">メール</label>
            <input
              type="email"
              value={data.email ?? ''}
              onChange={(e) => data.setEmail(e.target.value)}
              required
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* 電話番号 */}
          <div>
            <label className="block text-sm font-medium">電話番号</label>
            <input
              type="text"
              value={data.phone ?? ''}
              onChange={(e) => data.setPhone(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* 日時 */}
          <div>
            <label className="block text-sm font-medium">予約日時</label>
            <input
              type="datetime-local"
              value={data.date}
              onChange={(e) => data.setDate(e.target.value)}
              required
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium">備考</label>
            <textarea
              value={data.note}
              onChange={(e) => data.setNote(e.target.value)}
              rows={3}
              placeholder="例：ブリーチ履歴 / カラー希望"
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* 操作ボタン */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </form>

        {/* 閉じる */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-black text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
