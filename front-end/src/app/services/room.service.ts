import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { map, Observable } from 'rxjs';
import { Address } from '../common/address';
import { Room } from '../common/room';
import { HousesForRent } from '../common/house-for-rent';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
 

  DORMITORY_PATH = 'http://localhost:8087/dormitory';
  ROOM_PATH = 'http://localhost:8087/room'
  RESERVATION_PATH = "http://localhost:8087/reservation";
  CONTRACT_PATH = 'http://localhost:8087/contract';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  renewContract(contactId: string | undefined, 
    reNewContractForm: { 
      renewalDate: string; 
      renewalEndDate: string; 
      rentPrice: number; 
    }) : Observable<any>{

      const url = this.CONTRACT_PATH + `/${contactId}`;
    return this.http.put<any>(url, reNewContractForm)
  }

  createNewContract(contractForm: any) : Observable<any>{
    const url = this.CONTRACT_PATH;

    return this.http.post<any>(url, contractForm);
  }

  getAllDormitoryByOwnerId(): Observable<any> {
    const user = this.storageService.getUser();

    return this.http.get<HouseForRentResponse>(this.DORMITORY_PATH).pipe(
      map(response => {
        return {
          ...response,
          result: response.result.filter(dormitory => dormitory.ownerId === user?.id)
        };
      })
    );
  }

  createNewHouseforRent(house: any): Observable<CreateHouseResponse> {
    const user = this.storageService.getUser();

    const newHouse = {
      name: house.houseName,
      typeOfRental: house.typeOfRental,
      totalRooms: house.totalRooms,
      totalFloors: house.totalFloors,
      ownerId: user?.id,
      activeStatus: 'ACTIVE_STATUS',
      address: {
        province: house.province,
        district: house.district,
        ward: house.ward,
        streetDetail: house.streetDetail
      },
      services: [
        {
          serviceName: 'Tiền điện',
          serviceMetrics: 0,
          costType: 'FIXED',
          servicePriceDefault: 1700.0,
          unitOfMeasurement: 'KWH',
          activeStatus: house.electricityStatus
        },
        {
          serviceName: 'Tiền nước',
          serviceMetrics: 0,
          costType: 'FIXED',
          servicePriceDefault: 18000.0,
          unitOfMeasurement: 'CUBIC_METER',
          activeStatus: house.waterStatus

        },
        {
          serviceName: 'Tiền rác',
          serviceMetrics: 0,
          costType: 'FIXED',
          servicePriceDefault: 15000.0,
          unitOfMeasurement: 'MONTH',
          activeStatus: house.trashStatus
        },
        {
          serviceName: 'Tiền wifi',
          serviceMetrics: 0,
          costType: 'FIXED',
          servicePriceDefault: 50000.0,
          unitOfMeasurement: 'MONTH',
          activeStatus: house.wifiStatus
        }
      ]
    }

    console.log(newHouse)

    return this.http.post<CreateHouseResponse>(this.DORMITORY_PATH, newHouse);
  }

  createListNewRoom(
    room: any,
    houseforrentId: string,
    totalFloors: number,
    totalRooms: number
  ) {
    const roomsPerFloor = Math.ceil(totalRooms / totalFloors);

    for (let i = 0; i < totalRooms; i++) {
      const floorNumber = Math.floor(i / roomsPerFloor) + 1;
      const roomNumber = i + 1;
      const roomName = "Phòng " + roomNumber;

      // Tạo đối tượng new room
      const newRoom = {
        roomNumber: roomNumber,
        roomName: roomName,
        floorNumber: floorNumber,
        area: room.area,
        rentalPrice: room.rentalPrice,
        depositAmount: room.depositAmount,
        invoiceDate: room.invoiceDate,
        billingCycle: room.paymentCycle,
        financialStatus: "BILLING_CYCLE",
        status: room.roomStatus,
        maxOccupants: room.maxOccupants,
        housesForRentId: houseforrentId
      };

      console.log(newRoom)

      // Gửi request HTTP
      this.http.post(this.ROOM_PATH, newRoom).subscribe(response => {
        console.log(`Room ${roomName} created successfully.`);
      }, error => {
        console.error(`Error creating room ${roomName}:`, error);
      });
    }
  }

  createNewRoom(
    room: any, id: string, length: number) {
    const newRoom = {
      roomName: room.roomName,
      floorNumber: room.floorNumber,
      roomNumber: length + 1,
      area: room.area,
      rentalPrice: room.rentalPrice,
      depositAmount: room.depositAmount,
      invoiceDate: room.invoiceDate,
      billingCycle: room.paymentCycle,
      financialStatus: "BILLING_CYCLE",
      status: room.roomStatus,
      maxOccupants: room.maxOccupants,
      housesForRentId: id
    };

    this.http.post(this.ROOM_PATH, newRoom).subscribe(response => {
      console.log(`Room ${room.roomName} created successfully.`);
    }, error => {
      console.error(`Error creating room ${room.roomName}:`, error);
    });
  }

  getCurrentReservationByRoomId(roomId: string): Observable<any> {
    const url = `http://localhost:8087/reservation/currentReservation/${roomId}`;

    return this.http.get<any>(url);
  }

  editHouse(house: any, dorId: string): Observable<any> {
    const user = this.storageService.getUser();

    const edit = {
      name: house.houseName,
      typeOfRental: house.typeOfRental,
      ownerId: user?.id,
      address: {
        province: house.province,
        district: house.district,
        ward: house.ward,
        streetDetail: house.streetDetail
      }
    }

    const url = `${this.DORMITORY_PATH}/${dorId}`;

    return this.http.put<any>(url, edit)
  }

  getRoomById(roomId: string): Observable<any> {
    const url = `${this.ROOM_PATH}/${roomId}`;

    return this.http.get<any>(url);
  }

  depositRoom(deposit_form: any, roomId: string) {
    const url = this.RESERVATION_PATH + `/${roomId}`;

    return this.http.post(url, deposit_form);
  }

}

export interface Service {
  serviceId: string;
  serviceName: string; // Tên dịch vụ
  costType: 'FIXED' | 'VARIABLE'; // Loại chi phí (Cố định hay biến đổi)
  servicePriceDefault: number; // Giá dịch vụ mặc định
  unitOfMeasurement: 'KWH' | 'CUBIC_METER' | 'MONTH'; // Đơn vị đo lường
  activeStatus: string;
}

export interface House {
  name: string; // Tên nhà trọ
  typeOfRental: 'Dormitory' | 'Building'; // Loại nhà trọ
  totalFloors: number; // Tổng số tầng
  totalRooms: number; // Tổng số phòng
  ownerId: string; // ID chủ sở hữu
  activeStatus: 'ACTIVE_STATUS' | 'INACTIVE_STATUS'; // Trạng thái hoạt động
  services: Service[]; // Mảng dịch vụ
}

interface HouseForRentResponse {
  code: string;
  result: HousesForRent[];
}

export interface CreateHouseResponse {
  code: number; // Mã phản hồi
  result: {
    headers: {
      Location: string[]; // Địa chỉ của nhà trọ vừa được tạo
    };
    body: HousesForRent; // Thông tin chi tiết nhà trọ
  };
  statusCode: 'CREATED' | string; // Trạng thái của mã phản hồi
  statusCodeValue: number; // Mã giá trị trạng thái
}
