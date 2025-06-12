"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/AdminSidebar";
import AdminPageHeader from "@/components/AdminPageHeader";
import apiClient from "@/lib/apiClient";

interface SettingForm {
  reservationMax: number;
  isUnlimited: boolean;
  startTime: string;
  endTime: string;
  businessDays: string[];
  closedDays: string[];
  requirePhone: boolean;
  requireEmail: boolean;
  notifyReservation: boolean;
  notifyReminder: boolean;
  allowNomination: boolean;
  useIndividualStaffSlots: boolean;
}

const defaultForm: SettingForm = {
  reservationMax: 1,
  isUnlimited: false,
  startTime: "09:00",
  endTime: "18:00",
  businessDays: [],
  closedDays: [],
  requirePhone: false,
  requireEmail: false,
  notifyReservation: false,
  notifyReminder: false,
  allowNomination: true,
  useIndividualStaffSlots: false,
};

export default function AdminSettingEdit() {
  const params = useParams();
  const tenantId =
    typeof params?.uuid === "string"
      ? params.uuid
      : Array.isArray(params?.uuid)
      ? params.uuid[0]
      : (typeof window !== "undefined" && localStorage.getItem("tenantId")) || "";

  const [form, setForm] = useState<SettingForm>(defaultForm);
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = tenantId || (typeof window !== "undefined" && localStorage.getItem("tenantId"));
    if (!id) return;
    apiClient
      .get("/settings", { params: { tenantId: id } })
      .then((res) => {
        const data = res.data;
        setForm({
          reservationMax: data.reservationMax ?? 1,
          isUnlimited: data.isUnlimited ?? false,
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          businessDays: data.businessDays || [],
          closedDays: data.closedDays || [],
          requirePhone: data.requirePhone ?? false,
          requireEmail: data.requireEmail ?? false,
          notifyReservation: data.notifyReservation ?? false,
          notifyReminder: data.notifyReminder ?? false,
          allowNomination: data.allowNomination ?? true,
          useIndividualStaffSlots: data.useIndividualStaffSlots ?? false,
        });
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  const toggleDay = (day: string, list: string[]) => {
    if (list.includes(day)) {
      return list.filter((d) => d !== day);
    }
    return [...list, day];
  };

  const handleNotificationSave = async () => {
    if (!tenantId) return;
    try {
      await apiClient.put('/notifications/settings', {
        tenantId,
        notifyReservation: form.notifyReservation,
        notifyReminder: form.notifyReminder,
      });
      alert('通知設定を保存しました');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました');
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) return;
    try {
      await apiClient.post('/notifications/test', { email: testEmail });
      alert('テストメールを送信しました');
    } catch (err) {
      console.error(err);
      alert('送信に失敗しました');
    }
  };

  const handleSubmit = async () => {
    if (!tenantId) return;
    try {
      await apiClient.put(`/settings/${tenantId}`, form);
      alert("保存しました");
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4">読み込み中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <AdminPageHeader title="設定編集" />

        <div>
          <label className="block font-semibold mb-1">予約可能期間（月）</label>
          <input
            type="number"
            min={1}
            max={12}
            value={form.reservationMax}
            onChange={(e) => setForm({ ...form, reservationMax: Number(e.target.value) })}
            className="border p-2 w-24"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.isUnlimited}
              onChange={(e) => setForm({ ...form, isUnlimited: e.target.checked })}
            />
            <span>無制限にする</span>
          </label>
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="block font-semibold mb-1">開始時間</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="border p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">終了時間</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold">営業日</label>
          {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
            <button
              type="button"
              key={day}
              className={`px-2 py-1 mr-2 mt-2 border rounded ${form.businessDays.includes(day) ? "bg-blue-400 text-white" : ""}`}
              onClick={() => setForm({ ...form, businessDays: toggleDay(day, form.businessDays) })}
            >
              {day}
            </button>
          ))}
        </div>

        <div>
          <label className="block font-semibold">定休日</label>
          {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
            <button
              type="button"
              key={day}
              className={`px-2 py-1 mr-2 mt-2 border rounded ${form.closedDays.includes(day) ? "bg-red-400 text-white" : ""}`}
              onClick={() => setForm({ ...form, closedDays: toggleDay(day, form.closedDays) })}
            >
              {day}
            </button>
          ))}
        </div>

        <div>
          <label className="block font-semibold">顧客情報の入力必須</label>
          <label className="mr-4">
            <input
              type="checkbox"
              checked={form.requirePhone}
              onChange={(e) => setForm({ ...form, requirePhone: e.target.checked })}
            />
            電話番号
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.requireEmail}
              onChange={(e) => setForm({ ...form, requireEmail: e.target.checked })}
            />
            メールアドレス
          </label>
        </div>

        <div>
          <label className="block font-semibold">通知設定</label>
          <label className="mr-4">
            <input
              type="checkbox"
              checked={form.notifyReservation}
              onChange={(e) => setForm({ ...form, notifyReservation: e.target.checked })}
            />
            予約受付通知
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.notifyReminder}
              onChange={(e) => setForm({ ...form, notifyReminder: e.target.checked })}
            />
            リマインド通知
          </label>

          <div className="mt-2 space-x-2">
            <input
              type="email"
              placeholder="テスト送信先"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="border p-1"
            />
            <button
              type="button"
              onClick={sendTestEmail}
              className="px-2 py-1 bg-gray-600 text-white rounded"
            >
              テスト送信
            </button>
            <button
              type="button"
              onClick={handleNotificationSave}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              通知設定保存
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.allowNomination}
              onChange={(e) => setForm({ ...form, allowNomination: e.target.checked })}
            />
            <span>指名予約を許可する</span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.useIndividualStaffSlots}
              onChange={(e) => setForm({ ...form, useIndividualStaffSlots: e.target.checked })}
            />
            <span>スタッフ別の予約枠を利用する</span>
          </label>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          保存
        </button>
      </div>
    </AdminLayout>
  );
}
