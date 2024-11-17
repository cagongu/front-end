import { Address } from "./address";
import { Room } from "./room";
import { Service } from "./service";

export interface HousesForRent {
    id: string;
    name: string;
    typeOfRental: string;
    totalFloors: number;
    totalRooms: number;
    ownerId: string;
    rooms: Room[];
    address: Address;
    activeStatus: string;
    services: Service[];
}