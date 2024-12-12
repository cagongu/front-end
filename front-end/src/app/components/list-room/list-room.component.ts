import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Room } from '../../common/room';
import { RoomService } from '../../services/room.service';
import { HousesForRent } from '../../common/house-for-rent';
import { ServiceCustom } from '../../common/service-custom';
import { Furniture } from '../../common/furniture';
import { Reservation } from '../../common/reservation';
import { Contract } from '../../common/contract';
import { Invoice } from '../../common/invoice';

declare var bootstrap: any;

@Component({
  selector: 'app-list-room',
  templateUrl: './list-room.component.html',
  styleUrl: './list-room.component.css'
})
export class ListRoomComponent implements OnInit {
  @Output() roomSelected = new EventEmitter<any>();

  deposit_form = {
    description: '',
    tenantName: '',
    contactNumber: '',
    reservationDate: '',
    depositAmount: '',
    moveInDate: '',
    notes: ''
  };

  rooms: Room[] = [];
  dormitory: HousesForRent[] = [];
  index: number = parseInt(sessionStorage.getItem('DORMITORY_INDEX') || '0', 10);
  floorNumber: number = 0;

  currentRoom: Room | undefined;
  currentReservation: Reservation | undefined;
  currentContract: Contract | undefined;

  deposit_temp_amount_refund: number | undefined;

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

  contractForm = {
    contactDuration: '',
    moveInDate: '',
    terminationDate: '',
    memberCount: '',
    tenantName: '',
    phoneNumber: '',
    idCard: '',
    dob: '',
    gender: '',
    room: {
      roomId: '',
      roomNumber: 0,
      roomName: '',
      floorNumber: 0,
      area: 0,
      rentalPrice: 0,
      depositAmount: 0,
      debtAmount: 0,
      invoiceDate: 0,
      billingCycle: 0,
      moveInDate: new Date(),
      contractDuration: 1,
      financialStatus: '',
      status: '',
      electricityDefault: 0,
      waterDefault: 0,
      maxOccupants: 0,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      housesForRent: {} as HousesForRent,
      serviceCustoms: [] as ServiceCustom[],
      furnitures: [] as Furniture[],
      reservation: [] as Reservation[],
      invoices: [] as Invoice[],
      contracts: [] as Contract[]
    } as Room,
    paymentDate: '',
    notes: '',
    current: true,
  };

  reNewContractForm = {
    renewalDate: '',
    renewalEndDate: '',
    rentPrice: 0
  }

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.getAllDormitory();
  }

  getCurrentContract() {
    this.reNewContractForm.renewalDate = new Date().toISOString().slice(0, 16);
    this.currentRoom?.contracts?.forEach(contract => {
      console.log(contract)
      if (contract.current) {
        this.currentContract = contract;
      }
    });
  }

  submitRenewContract() {
    this.roomService.renewContract(this.currentContract?.contactId, this.reNewContractForm).subscribe(
      (response) => {
        console.log("RenewContract successfull");
        console.log(response.result);

        const modalElement = document.getElementById('renewContract');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide()

        this.reNewContractForm.renewalDate = '';
        this.reNewContractForm.renewalEndDate = '';
        this.reNewContractForm.rentPrice = 0;
      }
    );
    
  }

  getAllDormitory() {
    console.log("getAllDormitoryByOwnerId")

    this.roomService.getAllDormitoryByOwnerId().subscribe(
      res => {
        console.log("getAllDormitoryByOwnerId")
        console.log(res)
        this.dormitory = res.result;
        this.dormitory.forEach(dorm => {
          dorm.rooms.sort((a, b) => {
            if (a.floorNumber === b.floorNumber) {
              return a.roomNumber - b.roomNumber; // Sắp xếp theo số phòng
            }
            return a.floorNumber - b.floorNumber; // Sắp xếp theo số tầng
          });
        });
      }
    )
  }

  onCreateRoom() {
    this.roomService.createNewRoom(this.room, this.dormitory[this.index].id, this.dormitory[this.index].rooms.length);

    const modalElement = document.getElementById('addRoom');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    this.getAllDormitory();
  }

  updateFloorNumber(roomFloor: number) {
    this.floorNumber = roomFloor;
  }

  getCurrentRoom(roomId: string) {
    this.roomService.getRoomById(roomId).subscribe(
      (res) => {
        this.currentRoom = res.result;
        console.log(res.result)
        this.roomSelected.emit(this.currentRoom);
      }
    );
  }

  cocGiuChoSubmit() {
    console.log(this.deposit_form);

    if (this.currentRoom != null) {
      this.roomService.depositRoom(this.deposit_form, this.currentRoom?.roomId).subscribe(
        (res) => {
          console.log(res);
        }
      );
    }
    const modalElement = document.getElementById('cocGiuCho');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide()
  }

  getReservation() {
    this.currentRoom?.reservation?.forEach(reservation => {
      console.log(reservation)
      if (reservation.current) {
        this.currentReservation = reservation;
      }
    });
    console.log(this.currentReservation);
  }

  getFormattedDate(date: string | undefined): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  openAddNewContractModal() {
    if (this.currentRoom?.moveInDate != null) {
      const moveInDate = new Date(this.currentRoom.moveInDate);
      this.contractForm.moveInDate = moveInDate.toISOString().slice(0, 16);
    }

    if (this.currentRoom !== null && this.currentRoom?.roomId) {

      this.roomService.getCurrentReservationByRoomId(this.currentRoom?.roomId).subscribe(
        (res) => {
          console.log("getCurrenReservation")
          console.log(res);
          this.currentReservation = res.result;

          this.contractForm.tenantName = this.currentReservation?.tenantName ?? '';
          this.contractForm.phoneNumber = this.currentReservation?.contactNumber ?? '';

          this.contractForm.room = this.currentRoom!;
        },
        (error) => {
          console.log(error)
        }
      );

    }


  }

  addNewContract() {
    console.log("add new contract");
    console.log(this.contractForm);

    this.contractForm.room.contractDuration = parseInt(this.contractForm.contactDuration, 10);

    this.roomService.createNewContract(this.contractForm).subscribe(
      (response) => {
        console.log("add new contract response");
        console.log(response);

        const modalElement = document.getElementById('addNewContract');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide()
      },
      (error) => {
        console.log(error)
      }
    )
  }


  cancelDeposit() {

  }

}
