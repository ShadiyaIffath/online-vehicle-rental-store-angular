import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Rellax from 'rellax';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

import { InventoryService } from 'app/services/inventory/inventory.service';
import { VehicleType } from 'app/models/VehicleType';
import { Vehicle } from 'app/models/Vehicle';

const now = new Date();

@Component({
  selector: 'app-manage-vehicles',
  templateUrl: './manage-vehicles.component.html',
  styleUrls: ['./manage-vehicles.component.css']
})
export class ManageVehiclesComponent implements OnInit {
  today: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  vehicleTypes: any[];
  availability = [{ id: 0, type: 'All' }, { id: 1, type: 'Active' }, { id: 2, type: 'Inactive' }];
  vehicles: Vehicle[];
  filteredCars: Vehicle[];
  noVehicles: boolean = false;
  total: number;

  constructor(private inventoryService: InventoryService,
    private router: Router, private toastr: ToastrService,
    private parserFormatter: NgbDateParserFormatter,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    var rellaxHeader = new Rellax('.rellax-header');
    this.spinner.show();
    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.vehicleTypes.unshift({ id: 0, type: 'All' });
    });

    this.inventoryService.getVehicles().subscribe((data: any[]) => {
      this.vehicles = data;
      this.filteredCars = this.vehicles;
      this.total = this.getActiveVehiclesCount();
      this.noVehicleTag();
      this.spinner.hide();
    });

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  editVehicle(id: number) {
    this.inventoryService.selectVehicle(id);
    this.router.navigate(['components/car']);
  }

  updateVehicleStatus(selected: Vehicle) {
    let car = selected;
    this.inventoryService.updateVehicleStatus(car).subscribe(x => {
      this.toastr.success('Vehicle status updated.', 'Successful');
      this.total = !car.active == true ? this.total - 1 : this.total + 1;
      car.active = !car.active;
      if (!car.active) {
        car.dayRemoved = this.parserFormatter.format(this.today);
      }
      selected = car;
    }, err => {
      this.toastr.error('Vehicle removal failed', 'Failed');
    });
  }

  deleteVehicle(id: number){
    this.inventoryService.deleteVehicle(id).subscribe(() =>{
      this.toastr.success('Vehicle removed successfully', 'Deleted');
      this.spinner.show();
      this.inventoryService.getVehicles().subscribe((data: any[]) => {
        this.vehicles = data;
        this.filteredCars = this.vehicles;
        this.total = this.vehicles.length;
        this.noVehicleTag();
        this.spinner.hide();
      });
    },error=>{
      this.toastr.error('Vehicle removal failed', 'Failed');
    })
  }

  getActiveVehiclesCount(): number {
    let count = 0;
    for (var index: number = 0; index < this.vehicles.length; index++) {
      if (this.vehicles[index].active == true) {
        count++;
      }
    }
    return count;
  }

  activeFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredCars = this.vehicles;
    }
    else {
      let active = filter == 'Active' ? true : false;
      this.filteredCars = this.vehicles.filter(function (car) {
        return car.active === active;
      });
    }
    this.noVehicleTag();
  }

  typeFilter(event: any){
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredCars = this.vehicles;
    }
    else {
      this.filteredCars = this.vehicles.filter(function (car) {
        return car.type.type === filter;
      });
    }
    this.noVehicleTag();
  }

  noVehicleTag(){
    if (this.filteredCars.length == 0) {
      this.noVehicles = true;
    }
    else {
      this.noVehicles = false;
    }
  }
}
