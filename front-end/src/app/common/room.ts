import { Contract } from "./contract";
import { Furniture } from "./furniture";
import { HousesForRent } from "./house-for-rent";
import { Invoice } from "./invoice";
import { Reservation } from "./reservation";
import { ServiceCustom } from "./service-custom";

export interface Room {
    roomId: string;
    roomNumber: number;
    roomName: string;
    floorNumber: number;
    area: number;
    rentalPrice: number;
    depositAmount: number;
    debtAmount: number;
    invoiceDate: number;
    billingCycle: number;
    moveInDate: Date;
    contractDuration: number;
    financialStatus: string;
    status: string;
    maxOccupants: number;
    createdDate: Date;
    lastModifiedDate: Date;
    housesForRent: HousesForRent;
    serviceCustoms: ServiceCustom[];
    furnitures: Furniture[];
    reservation: Reservation[];
    invoices: Invoice[];
    contracts: Contract[];
  }