import { Room } from "./room";

export interface Invoice {
    invoiceId: string;
    room: Room;
    month: string;
    invoiceDate: Date;
    paymentDeadline: Date;
    isPaid: boolean;
    paymentDate: Date | null;
    reason: string;
    totalAmount: number;
    cost: number;
    finalAmount: number;
  }