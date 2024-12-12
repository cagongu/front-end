export interface Reservation {
    reservationId: string;
    description: string;
    tenantName: string;
    contactNumber: string;
    status :string;
    reservationDate: string;
    depositAmount: number;
    current: number;
    moveInDate: string;
    notes: string;
    createdDate: Date;
  }