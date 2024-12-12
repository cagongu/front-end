import { Room } from "./room";

export interface Contract {
  contactId: string;
  contactDuration: number;
  moveInDate: Date;
  terminationDate: Date;
  renewalDate: Date;
  renewalEndDate: Date;
  memberCount: number;
  tenantName: string;
  phoneNumber: string;
  idCard: string;
  dob: Date;
  gender: string;
  current: boolean;
  room: Room;
  paymentDate: Date;
  notes: string;
}
