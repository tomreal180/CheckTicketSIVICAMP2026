import type { Participant, Organizer, Equipment, EquipmentLog } from '../types';

// TODO: ĐIỀN ĐƯỜNG DẪN WEB APP CỦA BẠN VÀO ĐÂY
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRXwpc6RBPZG3i4w9v4kO9Vm2YG_PNKdspI1Ybni2f_x3iMsdbUbW3qkGm9giF-gDQ2g/exec';

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
  async checkInParticipant(qrData: string, event: string, BTC: boolean): Promise<Participant | Organizer> {
    return fetchAppScript({
      action: 'checkInParticipant',
      qrData: qrData,
      event: event,
      BTC: BTC,
    });
  },

  // 2. Lấy danh sách thiết bị khả dụng trong kho
  async getAvailableEquipments(): Promise<Equipment[]> {
    return fetchAppScript({
      action: 'getAvailableEquipments'
    });
  },

  // 2.5 Lấy danh sách thiết bị mà một BTC đang mượn
  async getBorrowedEquipments(btcId: string): Promise<{id: string, name: string}[]> {
    return fetchAppScript({
      action: 'getBorrowedEquipmentsByBTCID',
      borrower_id: btcId
    });
  },

  // 3. Kiểm tra BTC hợp lệ trước khi giao dịch thiết bị
  async checkBTC(qrData: string): Promise<Organizer> {
    return fetchAppScript({
      action: 'checkBTC',
      qrData: qrData
    });
  },

  // 4. Quét QR Mượn/Trả đồ (BTC)
  async handleEquipment(borrowerId: string, borrowerName: string, equipmentId: string, action: 'borrow' | 'return'): Promise<{ log: EquipmentLog, equipment: Equipment }> {
    return fetchAppScript({
      action: 'handleEquipment',
      borrowerId: borrowerId,
      borrowerName: borrowerName,
      equipmentId: equipmentId,
      actionType: action
    });
  },

  // 5. Thống kê Check-in
  async getAllCheckInStats(): Promise<Record<string, { participant: { count: number, total: number }, btc: { count: number, total: number } | null }>> {
    return fetchAppScript({
      action: 'getAllCheckInStats'
    });
  },

  // 6. Lấy danh sách thiết bị đang mượn
  async getAllBorrowedEquipments(): Promise<any[]> {
    return fetchAppScript({
      action: 'getAllBorrowedEquipments'
    });
  },

  // 7. Lấy kịch bản nhân sự (Tất cả các ngày)
  async getAllBtcSchedules(): Promise<Record<string, any[]>> {
    return fetchAppScript({
      action: 'getAllBtcSchedules'
    });
  },

  // 4. API Lấy thống kê
  async getStatistics() {
    return fetchAppScript({
      action: 'getStatistics'
    });
  },

  // 8. Lấy toàn bộ danh sách người tham gia của tất cả các sự kiện
  async getAllParticipants(): Promise<Record<string, any[]>> {
    return fetchAppScript({
      action: 'getAllParticipants'
    });
  }
};
