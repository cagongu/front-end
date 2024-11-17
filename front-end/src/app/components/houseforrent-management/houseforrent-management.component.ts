import { Component, OnInit } from '@angular/core';
import { HousesForRent } from '../../common/house-for-rent';
import { RoomService } from '../../services/room.service';
import { map } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-houseforrent-management',
  templateUrl: './houseforrent-management.component.html',
  styleUrl: './houseforrent-management.component.css'
})
export class HouseforrentManagementComponent implements OnInit {
  house = {
    houseName: '',
    typeOfRental: '',
    totalRooms: 0,
    totalFloors: 0,
    province: '',
    district: '',
    ward: '',
    streetDetail: '',
    electricityStatus: '',
    waterStatus: '',
    wifiStatus: '',
    trashStatus: ''
  };

  room = {
    rentalPrice: 0,
    area: 0,
    depositAmount: 0,
    invoiceDate: 6,
    maxOccupants: 1,
    paymentCycle: 1,
    roomStatus: 'VACANT'
  };

  dormitory: HousesForRent[] = [];
  index = 'DORMITORY_INDEX';
  dorId = "DORMITORY_ID"

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.getAllDormitoryByOwnerId().subscribe(
      res => {
        this.dormitory = res.result;
        console.log(this.dormitory);
      }
    )
  }

  getIndex(_t12: number, _dorId: string) {
    window.sessionStorage.removeItem(this.index);
    window.sessionStorage.setItem(this.index, _t12.toString());

    window.sessionStorage.removeItem(this.dorId);
    window.sessionStorage.setItem(this.dorId, _dorId);
  }

  // Hàm tạo nhà trọ
  onCreateHouse() {
    console.log('Tạo Nhà Trọ: ', this.house);

    // Ẩn lại modal
    const modalElement = document.getElementById('addBlock');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Giả sử lưu thành công thì mở modal tạo phòng trọ ngay
    this.openRoomModal(); // Gọi hàm mở modal phòng trọ
  }

  // Hàm tạo phòng trọ
  onCreateRoom() {
    // Xử lý lưu phòng trọ
    console.log('Tạo Phòng Trọ: ', this.room);

    this.roomService.createNewHouseforRent(this.house).subscribe(
      (response) => {
        // Lấy id từ phần body của phản hồi
        const houseId = response.result.body.id;
        const totalFloors = response.result.body.totalFloors;
        const totalRooms = response.result.body.totalRooms;

        console.log('ID của nhà trọ mới:', houseId);
        window.sessionStorage.setItem(this.dorId, houseId);



        // Bạn có thể thêm logic khác nếu cần sử dụng id này
        this.roomService.createListNewRoom(this.room, houseId, totalFloors, totalRooms)
      },
      (error) => {
        console.error('Đã xảy ra lỗi:', error);
      }
    );

    const modalElement = document.getElementById('addRoomModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  // Hàm mở modal tạo phòng trọ
  openRoomModal() {
    // Mở modal phòng trọ
    const roomModal = new bootstrap.Modal(document.getElementById('addRoomModal'));
    roomModal.show();
  }
}

