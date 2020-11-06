import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { InventoryService } from '../../services/inventory/inventory.service'
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UsersService } from 'app/services/users/users.service';
import { Vehicle } from 'app/models/Vehicle';
import { User } from 'app/models/User';


@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./fleet.component.css'],
})

export class FleetComponent implements OnInit {
  vehicleTypes: any[];
  vehicles: Vehicle[];
  filteredCars: Vehicle[];
  noVehicles: boolean = false;
  serviceFailed: boolean = false;
  closeResult: string;
  vehicle: Vehicle;
  accountId: number;
  account: User = new User();
  underAge: boolean = false;

  constructor(private inventoryService: InventoryService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.serviceFailed = false;
    },
      (error) => {
        this.serviceFailed = true;
      });
    this.inventoryService.getVehicles().subscribe((data: any[]) => {
      this.vehicles = data.filter(x => x.active == true);
      this.filteredCars = this.vehicles;

      if (this.vehicles.length === 0) {
        this.noVehicles = true;
      }
      else {
        this.noVehicles = false;
      }
      this.spinner.hide();
    });
    if (!this.authenticationService.isTokenExpired()) {
      this.accountId = Number(this.authenticationService.currentUserValue.nameid);
      this.userService.getAccountDetails(this.accountId).subscribe((data) => {
        this.account = data;
        this.account.dob = moment(this.account.dob).format("YYYY-MM-DD");
        this.account.age = moment().diff(this.account.dob, 'years');
        if (this.account.age < 25) {
          this.underAge = true;
        }
      });
    }
  }

  openVehicleContent(vehicleContent, vehicle) {
    this.modalService.open(vehicleContent, { size: 'lg', scrollable: true, backdropClass: 'light-red-backdrop', centered: true });
    vehicle.duration = moment().diff(vehicle.dayAdded, 'days');
    this.vehicle = vehicle;
  }

  typeChecked(value: any): void {
    //this.filteredCars.filter(item => { return item.checked; });
  }

  priceChecked(value: any): void{
    console.log(value);
  }

  filteredInventory() {
    return this.filteredCars;
  }

  underAgeError(type: string) : boolean{
    if(this.underAge == true && type !== 'Small town car'){
      this.toastr.error('You should be older than 25 to book this type');
      return true;
    }
    return false;
  }

  bookVehicle(id: number, type: string) {
    if(!this.underAgeError(type)){
    this.inventoryService.selectVehicle(id);
    this.router.navigate(['components/booking']);
    }
  }

  makereservation(id: number, type: string) {
    if(!this.underAgeError(type)){
    this.modalService.dismissAll();
    this.inventoryService.selectVehicle(id);
    this.router.navigate(['components/booking']);
    }
  }
}

