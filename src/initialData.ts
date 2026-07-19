/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Room, Facility, FoodDay, Review } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    type: 'Single',
    rent: 11000,
    deposit: 11000,
    availableBeds: 2,
    floorNumber: 1,
    size: '180 sq ft',
    attachedBathroom: true,
    balcony: true,
    ac: true,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience true luxury and absolute privacy in our premium single room. Fully furnished with a soft cozy mattress, dedicated study desk with reading lamp, spacious wooden wardrobe with safe lock, and an attached washroom with premium fittings. Features a private balcony overlooking the clean surrounding layouts.',
    amenities: ['Private Balcony', 'High-Speed Wi-Fi', 'Study Table', 'AC', 'Personal Wardrobe', 'Attached Bathroom', 'Daily Housekeeping', '24/7 Hot Water'],
    status: 'Available'
  },
  {
    id: 'room-2',
    type: 'Double',
    rent: 6500,
    deposit: 6500,
    availableBeds: 4,
    floorNumber: 1,
    size: '220 sq ft',
    attachedBathroom: true,
    balcony: true,
    ac: true,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Perfect for friends or young professionals who enjoy comfortable sharing. Features two premium single beds with modern medical-grade mattresses, individual study desks, and separate lockers. The room includes a large window and sliding door opening to a beautiful private balcony.',
    amenities: ['Private Balcony', 'Individual Study Desks', 'High-Speed Wi-Fi', 'AC', 'Individual Wardrobes', 'Attached Bathroom', 'Daily Housekeeping', 'Hot Water'],
    status: 'Available'
  },
  {
    id: 'room-3',
    type: 'Triple',
    rent: 5500,
    deposit: 5500,
    availableBeds: 3,
    floorNumber: 2,
    size: '260 sq ft',
    attachedBathroom: true,
    balcony: false,
    ac: false,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A pocket-friendly option without compromising on quality or hygiene. The triple sharing room is highly spacious, featuring comfortable single beds, separate individual wardrobes, and a large attached premium washroom. Ideal for students who want a lively study environment.',
    amenities: ['High-Speed Wi-Fi', 'Individual Wardrobes', 'Attached Bathroom', 'Comfortable Single Beds', 'Study Desks', 'Daily Housekeeping', 'Hot Water'],
    status: 'Available'
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'f-wifi',
    name: 'High-Speed WiFi',
    iconName: 'Wifi',
    description: 'Uninterrupted 150+ Mbps fiber internet throughout the building to support your study or work-from-home needs.'
  },
  {
    id: 'f-security',
    name: 'CCTV Security',
    iconName: 'ShieldCheck',
    description: '24/7 security surveillance with cameras at entrances, corridors, and biometric locks to guarantee absolute safety.'
  },
  {
    id: 'f-backup',
    name: 'Power Backup',
    iconName: 'Zap',
    description: 'Complete 100% electricity backup system so you never experience darkness or workspace disruptions.'
  },
  {
    id: 'f-water',
    name: 'RO Drinking Water',
    iconName: 'Droplet',
    description: 'Multi-stage reverse osmosis water filters installed on every floor, providing sweet, clean, hygienic drinking water.'
  },
  {
    id: 'f-washing',
    name: 'Washing Machine',
    iconName: 'WashingMachine',
    description: 'Fully automatic laundry washing machines available with separate schedules to ensure clean, easy clothes washing.'
  },
  {
    id: 'f-housekeeping',
    name: 'Housekeeping',
    iconName: 'Sparkles',
    description: 'Professional cleaning staff clean the rooms, corridors, and attached bathrooms daily to maintain visual hygiene.'
  },
  {
    id: 'f-hotwater',
    name: 'Hot Water',
    iconName: 'Flame',
    description: 'Energy-efficient solar heaters backed by electrical geysers to provide hot water in washrooms 24/7.'
  },
  {
    id: 'f-parking',
    name: 'Parking',
    iconName: 'Car',
    description: 'Ample shaded basement parking for two-wheelers and scooters, safely secured under CCTV surveillance.'
  },
  {
    id: 'f-lift',
    name: 'Lift',
    iconName: 'ArrowUpDown',
    description: 'Smooth, spacious automatic elevator to comfortably carry you and your luggage across all floors.'
  },
  {
    id: 'f-rooftop',
    name: 'Rooftop Screening',
    iconName: 'Tv',
    description: 'A cozy decorated open-air rooftop with seating, perfect for evening study breaks or weekend movie screenings.'
  },
  {
    id: 'f-digital-menu',
    name: 'Digital Menu',
    iconName: 'Menu',
    description: 'View the weekly food schedule online or on your mobile device at any time, with a digital meal planner.'
  },
  {
    id: 'f-hygienic-food',
    name: 'Hygienic Food',
    iconName: 'UtensilsCrossed',
    description: 'Highly nutritious, homely food prepared under supreme kitchen hygiene, matching both South and North Indian tastes.'
  },
  {
    id: 'f-rice',
    name: 'White & Red Rice',
    iconName: 'Wheat',
    description: 'We serve both premium traditional White Rice and healthy high-fiber Red Rice options to support your diet preferences.'
  }
];

export const INITIAL_FOOD_MENU: FoodDay[] = [
  {
    day: 'Monday',
    breakfast: 'Idli & Vada with Sambar & Coconut Chutney',
    lunch: 'Veg Biryani, Raita, Dal Tadka, White/Red Rice, Phulka',
    snacks: 'Onion Pakoda & Masala Chai',
    dinner: 'Phulka, Paneer Butter Masala, White/Red Rice, Rasam'
  },
  {
    day: 'Tuesday',
    breakfast: 'Puri Sagu & Chutney',
    lunch: 'North Indian Thali: Veg Kurma, Dal Fry, Jeera Rice, Phulka, Curd',
    snacks: 'Samosa & Hot Coffee',
    dinner: 'Egg Curry / Veg Paneer Kadai, White/Red Rice, Sambar, Phulka'
  },
  {
    day: 'Wednesday',
    breakfast: 'Aloo Paratha with Curd & Pickle',
    lunch: 'Hyderabadi Veg Pulao, Curd Rice, Potato Fry, White/Red Rice',
    snacks: 'Sweet Corn Cup & Filter Coffee',
    dinner: 'South Indian Special: Sambar, Rice, Beetroot Poriyal, Curd, Phulka'
  },
  {
    day: 'Thursday',
    breakfast: 'Set Dosa with Vegetable Sagu',
    lunch: 'Phulka, Mixed Vegetable Sabzi, Dal Palak, White/Red Rice, Papad',
    snacks: 'Bread Butter Toast & Tea',
    dinner: 'Phulka, Aloo Gobi Masala, White/Red Rice, Buttermilk, Curry'
  },
  {
    day: 'Friday',
    breakfast: 'Poha with Sev & Coconut Chutney',
    lunch: 'Jeera Rice, Chana Masala, Phulka, Curd, White/Red Rice',
    snacks: 'Banana Fritters & Chai',
    dinner: 'Special Veg Fried Rice, Manchurian Gravy, Soup, White Rice'
  },
  {
    day: 'Saturday',
    breakfast: 'Chow Chow Bath (Kesari Bath & Khara Bath)',
    lunch: 'Phulka, Bhindi Fry, Dal Fry, White/Red Rice, Rasam, Curd',
    snacks: 'Biscuits & Tea',
    dinner: 'Dosa Special: Masala Dosa, Chutney, Sambhar, White Rice'
  },
  {
    day: 'Sunday',
    breakfast: 'Special Masala Dosa with Chutney & Filter Coffee',
    lunch: 'Festive Special: Sweet Payasam, Poori, Chana Bathura, Veg Kurma, Pulao, Curd',
    snacks: 'Veg Cutlet & Tea/Coffee',
    dinner: 'Light Dinner: Khichdi, Kadhi, White Rice, Papad, Pickle'
  }
];

export const INITIAL_TODAYS_SPECIAL = 'Mouth-watering Paneer Butter Masala with Hot Garlic Phulkas!';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Suhasini Rao',
    role: 'Software Engineer at Cisco',
    rating: 5,
    text: 'Angels PG is hands down the best and safest place to live for ladies in Shanthipura. The biometric entrance, kind wardens, and 24/7 security give me peace of mind. The rooms are incredibly clean and feel very premium!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-2',
    name: 'Megha Deshpande',
    role: 'Student at Azim Premji University',
    rating: 5,
    text: 'Homely food is hard to find in hostels, but here we get amazing hot meals! The digital menu is so convenient, and having options for both white rice and red rice is a lifesaver for health-conscious girls like me.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-3',
    name: 'Kavya S.',
    role: 'Trainee at Wipro',
    rating: 5,
    text: 'Super high-speed WiFi and constant power backup made it very easy to complete my official tasks. Daily housekeeping ensures everything is sparkling clean. Highly recommend Angels PG!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  }
];
