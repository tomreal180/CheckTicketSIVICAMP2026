export interface Participant {
  id: string;
  name: string;
  ticketType: 'DAY PASS' | 'FULL EXPERIENCE PASS' | 'BTC';
  status: 'valid' | 'used' | 'invalid';
  size: string;
  house: string;
  team: string;
  hotel_room: string;
  message?: string;
}

export interface Organizer {
  id: string;
  name: string;
  status?: 'active' | 'inactive';
  mission?: string;
  size?: string;
  hotel_room?: string;
  message?: string;
}

export interface Equipment {
  id: string;
  name: string;
  total: number;
  available: number;
}

export interface EquipmentLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  borrowerId: string;
  borrowerName: string;
  borrowTime: string;
  returnTime?: string;
  status: 'borrowed' | 'returned';
}

export interface CheckInLog {
  id: string;
  participantId: string;
  participantName: string;
  eventId: string;
  timestamp: string;
}
