export interface CarItem {
  name: string;
  type: string;
  stock: string;
}

export interface CarSettingData {
  items: CarItem[];
  deposit: number;
  lateFee: string;
  useInventory: boolean;
}

export interface ClinicStaff {
  name: string;
  department: string;
  schedule: string;
}

export interface ClinicMenu {
  name: string;
  time: string;
  insured: boolean;
}

export interface ClinicSettingData {
  staffList: ClinicStaff[];
  menus: ClinicMenu[];
  questions: string[];
  followup: string;
}

export interface EventInfo {
  title: string;
  date: string;
  location: string;
  capacity: string;
}

export interface EventTicket {
  type: string;
  price: string;
  quantity: string;
}

export interface EventSettingData {
  events: EventInfo[];
  tickets: EventTicket[];
  enablePayment: boolean;
  enableWaitlist: boolean;
}

export interface RentalRoom {
  name: string;
  capacity: string;
  facilities: string;
}

export interface RentalPricing {
  day: string;
  time: string;
  price: string;
}

export interface RentalOption {
  name: string;
  price: string;
  available: boolean;
}

export interface RentalSettingData {
  rooms: RentalRoom[];
  pricing: RentalPricing[];
  options: RentalOption[];
  allowChain: boolean;
}

export interface RestaurantSeat {
  type: string;
  count: string;
}

export interface RestaurantCourse {
  name: string;
  price: string;
  preOrder: boolean;
}

export interface RestaurantSettingData {
  seats: RestaurantSeat[];
  courses: RestaurantCourse[];
  maxGuests: number;
  cancelPolicy: string;
}

export interface SalonStaff {
  name: string;
  selectable: boolean;
  specialties: string;
  maxSlots?: number;
}

export interface SalonMenu {
  name: string;
  time: string;
  price: string;
  allowMultiple: boolean;
}

export interface SalonCoupon {
  firstTime: number;
  repeat: number;
}

export interface SalonSettingData {
  staffList: SalonStaff[];
  menuList: SalonMenu[];
  coupon: SalonCoupon;
  allowNomination: boolean;
}

export interface SchoolLesson {
  name: string;
  day: string;
  time: string;
}

export interface SchoolInstructor {
  name: string;
  subjects: string;
}

export interface SchoolSettingData {
  lessons: SchoolLesson[];
  instructors: SchoolInstructor[];
  billingType: 'monthly' | 'ticket';
  allowMakeup: boolean;
}

export type BusinessFormData =
  | CarSettingData
  | ClinicSettingData
  | EventSettingData
  | RentalSettingData
  | RestaurantSettingData
  | SalonSettingData
  | SchoolSettingData;
