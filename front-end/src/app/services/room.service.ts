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

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllDormitoryByOwnerId(): Observable<HouseForRentResponse> {
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

  public createNewHouseforRent(house: {
    houseName: string;
    typeOfRental: string;
    totalRooms: number;
    totalFloors: number;
    province: string;
    district: string;
    ward: string;
    streetDetail: string;
    electricityStatus: string;
    waterStatus: string;
    wifiStatus: string,
    trashStatus: string
  }): Observable<CreateHouseResponse> {
    const user = this.storageService.getUser();

    const newHouse = {
      name: house.houseName,
      typeOfRental: house.typeOfRental,
      totalFloors: house.totalFloors,
      totalRooms: house.totalRooms,
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

    return this.http.post<CreateHouseResponse>(this.DORMITORY_PATH, newHouse);
  }

  public createListNewRoom(
    room: {
      rentalPrice: number;
      area: number;
      depositAmount: number;
      invoiceDate: number;
      maxOccupants: number;
      paymentCycle: number;
      roomStatus: string;
    },
    houseforrentId: string,
    totalFloors: number,
    totalRooms: number
  ) {
    const roomsPerFloor = Math.ceil(totalRooms / totalFloors); // Tính số phòng trên mỗi tầng

    for (let i = 0; i < totalRooms; i++) {
      const floorNumber = Math.floor(i / roomsPerFloor) + 1; // Xác định số tầng
      const roomNumber = i + 1; // Số phòng bắt đầu từ 1
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

  public createNewRoom(
    room: {
      roomName: string;
      floorNumber: number;
      rentalPrice: number;
      area: number;
      depositAmount: number;
      invoiceDate: number;
      maxOccupants: number; 
      paymentCycle: number; 
      roomStatus: string;
    }, id: string) { 
      const newRoom = {
        roomName: room.roomName,
        floorNumber: room.floorNumber,
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

}

export interface Service {
  serviceName: string; // Tên dịch vụ
  serviceMetrics: number; // Đơn vị đo lường cho dịch vụ
  costType: 'FIXED' | 'VARIABLE'; // Loại chi phí (Cố định hay biến đổi)
  servicePriceDefault: number; // Giá dịch vụ mặc định
  unitOfMeasurement: 'KWH' | 'CUBIC_METER' | 'MONTH'; // Đơn vị đo lường
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
