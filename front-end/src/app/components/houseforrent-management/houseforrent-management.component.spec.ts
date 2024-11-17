import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseforrentManagementComponent } from './houseforrent-management.component';

describe('HouseforrentManagementComponent', () => {
  let component: HouseforrentManagementComponent;
  let fixture: ComponentFixture<HouseforrentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseforrentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseforrentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
