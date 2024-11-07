import { Timestamp } from 'firebase/firestore';

export interface Service {
  name: string;
  parent?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  services: { [key: string]: Service };
  paymentStatus: string;
  pickupTime: TimeOptions;
  deliveryTime: TimeOptions;
  totalPrice: number;
  createdAt: Timestamp;
  paymentLink?: string;
}

export type TimeOptions = {
  date: string;
  time: string;
};
