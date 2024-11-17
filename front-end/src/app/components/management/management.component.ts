import { Component } from '@angular/core';
import { HousesForRent } from '../../common/house-for-rent';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {
  dormitory: HousesForRent[] = [];
  index: number = parseInt( sessionStorage.getItem('DORMITORY_INDEX') || '0', 10);

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.getAllDormitoryByOwnerId().subscribe(
      res => {
        this.dormitory = res.result;
      }
    )
  }
}
