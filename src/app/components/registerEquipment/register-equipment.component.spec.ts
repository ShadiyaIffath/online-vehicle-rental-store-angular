import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEquipmentComponent } from './register-equipment.component';

describe('RegisterEquipmentComponent', () => {
  let component: RegisterEquipmentComponent;
  let fixture: ComponentFixture<RegisterEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
