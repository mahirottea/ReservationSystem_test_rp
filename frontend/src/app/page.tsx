'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const businessTypes = [
  { id: 'salon', label: '美容・サロン系' },
  { id: 'clinic', label: '医療・クリニック系' },
  { id: 'rental', label: '会議室・レンタルスペース系' },
  { id: 'restaurant', label: '飲食店・居酒屋系' },
  { id: 'car', label: 'レンタル設備・レンタカー系' },
  { id: 'event', label: 'イベント・セミナー系' },
  { id: 'school', label: 'スクール・習い事系' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleSelect = (id: string) => {
    localStorage.setItem('selectedBusiness', id);
    router.push('/settings/common');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('welcome')}</h1>
      <p className="mb-2">業種を選択してください</p>
      <ul className="space-y-2">
        {businessTypes.map((type) => (
          <li
            key={type.id}
            className="cursor-pointer p-3 border rounded hover:bg-gray-100"
            onClick={() => handleSelect(type.id)}
          >
            {type.label}
          </li>
        ))}
      </ul>
    </div>
  );
}