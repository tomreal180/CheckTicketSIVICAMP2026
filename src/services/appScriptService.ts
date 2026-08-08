import type { Participant, Equipment, EquipmentLog } from '../types';

// TODO: ĐIỀN ĐƯỜNG DẪN WEB APP CỦA BẠN VÀO ĐÂY
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqpVx1FujysPSyhQLkdGwh6ZRLfOUtJxeTBHUOzpJvqqtvH4F5V8v1p93fxGTv2I04PQ/exec';

/**
 * Hàm helper để gọi API tới Google App Script.
 * Lưu ý: Google App Script thường gặp vấn đề CORS preflight (lỗi OPTIONS) nếu dùng 'application/json'.
 * Mẹo là dùng 'text/plain;charset=utf-8' cho Content-Type, khi đó request sẽ đi qua dễ dàng.
 * Trong file Code.gs của bạn, hãy parse body bằng: const body = JSON.parse(e.postData.contents);
 */
async function fetchAppScript(payload: any) {
  if (GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    throw new Error('Vui lòng cập nhật GOOGLE_SCRIPT_URL trong src/services/appScriptService.ts');
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Giả định GAS trả về format: { success: true, data: ... } hoặc { success: false, message: '...' }
    if (!data.success) {
      throw new Error(data.message || 'Có lỗi xảy ra từ máy chủ');
    }

    return data.data;
  } catch (error: any) {
    console.error('AppScript API Error:', error);
    throw new Error(error.message || 'Lỗi kết nối tới máy chủ Google');
  }
}

export const AppScriptService = {
  // 1. Quét QR Check-in người tham gia
  async checkInParticipant(qrData: string, event: string): Promise<Participant> {
    return fetchAppScript({
      action: 'checkInParticipant',
      qrData: qrData,
      event: event
    });
  },

  // 2. Lấy danh sách thiết bị
  async getEquipments(): Promise<Equipment[]> {
    return fetchAppScript({
      action: 'getEquipments'
    });
  },

  // 3. Quét QR Mượn/Trả đồ (BTC)
  async handleEquipment(qrData: string, equipmentId: string, action: 'borrow' | 'return'): Promise<{ log: EquipmentLog, equipment: Equipment }> {
    return fetchAppScript({
      action: 'handleEquipment',
      qrData: qrData,
      equipmentId: equipmentId,
      actionType: action
    });
  },

  // 4. API Lấy thống kê
  async getStatistics() {
    return fetchAppScript({
      action: 'getStatistics'
    });
  }
};
