import { Component, OnInit } from '@angular/core';
import { Room } from '../../common/room';
import { RoomService } from '../../services/room.service';
import { HousesForRent } from '../../common/house-for-rent';

declare var bootstrap: any;


@Component({
  selector: 'app-list-room',
  templateUrl: './list-room.component.html',
  styleUrl: './list-room.component.css'
})
export class ListRoomComponent implements OnInit {


  rooms: Room[] = [];
  dormitory: HousesForRent[] = [];
  index: number = parseInt(sessionStorage.getItem('DORMITORY_INDEX') || '0', 10);
  floorNumber: number = 0;
  room = {
    roomName: '',
    floorNumber: 1,
    rentalPrice: 0,
    area: 0,
    depositAmount: 0,
    invoiceDate: 6,
    maxOccupants: 1,
    paymentCycle: 1,
    roomStatus: 'VACANT'
  };



  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.getAllDormitory();
  }

  getAllDormitory(){
    this.roomService.getAllDormitoryByOwnerId().subscribe(
      res => {
        this.dormitory = res.result;
        this.dormitory.forEach(dorm => {
          dorm.rooms.sort((a, b) => a.roomNumber - b.roomNumber);
        });
      }
    )
  }


  onCreateRoom() {
    this.roomService.createNewRoom(this.room, this.dormitory[this.index].id);

    const modalElement = document.getElementById('addRoom');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    this.getAllDormitory();
  }

  updateFloorNumber(roomFloor: number) {
    this.floorNumber = roomFloor;
  }
}
