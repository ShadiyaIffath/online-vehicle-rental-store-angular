import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmvComponent } from './dmv.component';

describe('DmvComponent', () => {
  let component: DmvComponent;
  let fixture: ComponentFixture<DmvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
