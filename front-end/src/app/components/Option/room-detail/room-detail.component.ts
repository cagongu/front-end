import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Room } from '../../../common/room';
import { Contract } from '../../../common/contract';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css'
})
export class RoomDetailComponent implements OnChanges {


  @Input() room: Room | undefined;
  currentContract: Contract | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room']) {
      this.room?.contracts?.forEach(contract => {
        if (contract.current) {
          this.currentContract = contract;
          console.log("find currentContract");

          console.log(contract);
        }
      });
    }
  }

  getCurrentContract() {
    this.room?.contracts?.forEach(contract => {
      if (contract.current) {
        this.currentContract = contract;
        console.log("find currentContract");

        console.log(contract);
      }
    });
  }
}
