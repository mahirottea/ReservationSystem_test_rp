import apiClient from '../apiClient';

export async function saveSetting(data: any, tenantId?: string) {
  try {
    if (tenantId) {
      // 更新時：PUT /setup
      const res = await apiClient.put(`/setup`, { tenantId, ...data });
      return res.data;
    } else {
      // 新規登録時：POST /setup
      const res = await apiClient.post('/setup', data);
      return res.data;
    }
  } catch (err) {
    console.error('保存エラー:', err);
    throw err;
  }
}
