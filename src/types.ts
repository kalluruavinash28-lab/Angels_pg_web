/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomType = 'Single' | 'Double' | 'Triple';

export interface Room {
  id: string;
  type: RoomType;
  rent: number;
  deposit: number;
  availableBeds: number;
  floorNumber: number;
  size: string;
  attachedBathroom: boolean;
  balcony: boolean;
  ac: boolean;
  images: string[];
  description: string;
  amenities: string[];
  status: 'Available' | 'Fully Booked';
}

export interface Booking {
  id: string;
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email: string;
  collegeOrCompany: string;
  occupation: 'Student' | 'Employee';
  gender: string;
  address: string;
  idProofType: string;
  idProofFile?: string;
  idProofFileName?: string;
  preferredRoomType: RoomType;
  checkInDate: string;
  expectedStayDuration: string;
  numberOccupants: number;
  specialRequirements: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  bookingDate: string;
  roomId?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Facility {
  id: string;
  name: string;
  iconName: string; // Used to look up Lucide icons
  description: string;
}

export interface FoodDay {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface FoodMenu {
  days: FoodDay[];
  todaysSpecial: string;
}
