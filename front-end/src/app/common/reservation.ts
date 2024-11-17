export interface Reservation {
    reservationId: string;
    description: string;
    tenantName: string;
    contactNumber: string;
    reservationDate: Date;
    depositAmount: number;
    moveInDate: Date;
    notes: string;
  }