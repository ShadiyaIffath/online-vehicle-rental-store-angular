import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { InventoryService } from '../../services/inventory/inventory.service'
import { Vehicle } from 'app/models/Vehicle';
import { NgxSpinnerService } from 'ngx-spinner';


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

  constructor(private inventoryService: InventoryService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal) {    
  }

  ngOnInit(): void {
    this.spinner.show();
    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.serviceFailed = false;
    },
    (error)=>{ 
      this.serviceFailed = true;
    });
    this.inventoryService.getVehicles().subscribe((data: any[]) =>{
      this.vehicles = data.filter(x=> x.active ==  true);
      this.filteredCars = this.vehicles;

      if (this.vehicles.length === 0) {
        this.noVehicles = true;
      }
      else {  
        this.noVehicles = false;
      }
      this.spinner.hide();
    });
  }

  openVehicleContent(vehicleContent, vehicle) {
    this.modalService.open(vehicleContent, { size: 'lg', scrollable: true , backdropClass: 'light-red-backdrop', centered: true });
    vehicle.duration = moment().diff(vehicle.dayAdded, 'days');
    this.vehicle = vehicle;
    }

  typeChecked(): void {
    //this.filteredCars.filter(item => { return item.checked; });
  }

  filteredInventory() {
    this.typeChecked();
    return this.filteredCars;
  }

  bookVehicle(id: number) {
    this.inventoryService.selectVehicle(id);
    this.router.navigate(['components/booking']);
  }

  makereservation(id: number) {
    this.modalService.dismissAll();
    this.inventoryService.selectVehicle(id);
    this.router.navigate(['components/booking']);
  }
}

