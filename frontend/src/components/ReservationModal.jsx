import React from 'react';
import apiClient from '@/lib/apiClient';
import PaymentForm from './PaymentForm';

export default function ReservationModal(props) {
  if (!props.isOpen) return null;

  const {
    isOpen,
    onClose,
    onSave,
    onDelete,
    reservationId,
    data,
    staffList,
    serviceList,
    useIndividualStaffSlots,
    individualSlotStats,
  } = props;

  const totalAmount = data.serviceIds.reduce((sum, id) => {
    const s = serviceList.find((svc) => svc.id === id);
    return sum + (s?.price || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg relative">
        <h2 className="text-xl font-bold mb-4">予約編集</h2>

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
            <label className="block text-sm font-medium">メールアドレス</label>
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
            <label className="block text-sm font-medium">電話番号（任意）</label>
            <input
              type="text"
              value={data.phone ?? ''}
              onChange={(e) => data.setPhone(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* スタッフ */}
          <div>
            <label className="block text-sm font-medium">スタッフ</label>
            <select
              value={data.staffId}
              onChange={(e) => data.setStaffId(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
          >
            <option value="">選択してください</option>
              {staffList.map((s) => {
                const dateKey = data.date.split('T')[0];
                const timeKey = data.date.split('T')[1]?.slice(0, 5);
                const remaining = individualSlotStats?.[dateKey]?.[timeKey]?.[s.id] ?? null;
                const isDisabled = useIndividualStaffSlots && remaining !== null && remaining <= 0;

                return (
                  <option
                    key={s.id}
                    value={s.id}
                    disabled={isDisabled}
                    className={isDisabled ? 'text-red-500' : ''}
                  >
                    {s.name} {isDisabled ? '×' : ''}
                  </option>
                );
              })} 
            </select>
          </div>

          {/* コース */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">コース選択：</label>
            <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-2">
              {serviceList.map((service) => (
                <label key={service.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={service.id}
                    checked={data.serviceIds.includes(service.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        data.setServiceIds([...data.serviceIds, service.id]);
                      } else {
                        data.setServiceIds(data.serviceIds.filter((id) => id !== service.id));
                      }
                    }}
                  />
                  <span>{service.name}</span>
                </label>
              ))}
            </div>
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

        {reservationId && totalAmount > 0 && (
          <PaymentForm amount={totalAmount} reservationId={reservationId} />
        )}

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
