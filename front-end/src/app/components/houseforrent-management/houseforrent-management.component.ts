import { Component, OnInit } from '@angular/core';
import { HousesForRent } from '../../common/house-for-rent';
import { RoomService } from '../../services/room.service';
import { map } from 'rxjs';
import { ProvinceApiService } from '../../services/province-api.service';

declare var bootstrap: any;

@Component({
  selector: 'app-houseforrent-management',
  templateUrl: './houseforrent-management.component.html',
  styleUrl: './houseforrent-management.component.css'
})
export class HouseforrentManagementComponent implements OnInit {
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

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

  constructor(private roomService: RoomService, private locationService: ProvinceApiService) { }

  ngOnInit(): void {
    this.getAllDomitory();
    this.loadProvinces();
  }

  loadProvinces() {
    this.locationService.getProvinces().subscribe(data => {
      this.provinces = data;
    });
  }

  onProvinceChange(event: any) {
    this.locationService.getDistricts(event.target.value).subscribe(data => {
      this.districts = data.districts;
      this.wards = [];  // Reset wards when province changes
    });
  }

  onDistrictChange(event: any) {
    this.locationService.getWards(event.target.value).subscribe(data => {
      this.wards = data.wards;
    });
  }

  onEditHouse() {
    const dorId = sessionStorage.getItem(this.dorId);

    if (dorId != null) {
      this.roomService.editHouse(this.house, dorId).subscribe(
        (response) => {
          console.log(response);
          const modalElement = document.getElementById('editBlock');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      )
    }
    
  }

  getAllDomitory() {
    this.roomService.getAllDormitoryByOwnerId().subscribe(
      res => {
        this.dormitory = res.result;
        console.log(this.dormitory);
      }
    )
  }

  setIndex(_t12: number, _dorId: string) {
    window.sessionStorage.removeItem(this.index);
    window.sessionStorage.setItem(this.index, _t12.toString());

    window.sessionStorage.removeItem(this.dorId);
    window.sessionStorage.setItem(this.dorId, _dorId);
  }

  getEditData(i: number) {
    this.setIndex(i, this.dormitory[i].id)

    console.log(this.dormitory[i])
    this.house.houseName = this.dormitory[i].name;
    this.house.typeOfRental = this.dormitory[i].typeOfRental;
    this.house.totalRooms = this.dormitory[i].totalFloors;
    this.house.totalFloors = this.dormitory[i].totalRooms;

    // Lấy mã tỉnh từ dữ liệu nhà trọ và tìm tên tỉnh
    this.house.province = this.dormitory[i].address.province;

    // Lấy mã quận từ dữ liệu nhà trọ
    this.house.district = this.dormitory[i].address.district;

    // Gọi API lấy danh sách quận, sau đó tìm tên quận
    this.locationService.getDistricts(this.house.province).subscribe(data => {
      this.districts = data.districts; // Đảm bảo dữ liệu quận được cập nhật

      // Gọi API lấy danh sách phường khi đã có danh sách quận
      this.house.ward = this.dormitory[i].address.ward;
      this.locationService.getWards(this.house.district).subscribe(data => {
        this.wards = data.wards; // Đảm bảo dữ liệu phường được cập nhật
      });
    });

    // Lấy chi tiết đường phố
    this.house.streetDetail = this.dormitory[i].address.streetDetail;


    this.dormitory[i].services.forEach((element) => {
      switch (element.serviceName) {
        case "Tiền điện":
          this.house.electricityStatus = element.activeStatus === "ACTIVE_STATUS" ? 'ACTIVE_STATUS' : 'DELETED_STATUS';
          break;
        case "Tiền nước":
          this.house.waterStatus = element.activeStatus === "ACTIVE_STATUS" ? 'ACTIVE_STATUS' : 'DELETED_STATUS';
          break;
        case "Tiền wifi":
          this.house.wifiStatus = element.activeStatus === "ACTIVE_STATUS" ? 'ACTIVE_STATUS' : 'DELETED_STATUS';
          break;
        case "Tiền rác":
          this.house.trashStatus = element.activeStatus === "ACTIVE_STATUS" ? 'ACTIVE_STATUS' : 'DELETED_STATUS';
          break;
      }
    });
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

