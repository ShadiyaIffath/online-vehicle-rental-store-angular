import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Rellax from 'rellax';
import { Router } from '@angular/router';

import { InventoryService } from 'app/services/inventory/inventory.service';
import { VehicleType } from 'app/models/VehicleType';
import { Vehicle } from 'app/models/Vehicle';

@Component({
  selector: 'app-manage-vehicles',
  templateUrl: './manage-vehicles.component.html',
  styleUrls: ['./manage-vehicles.component.css']
})
export class ManageVehiclesComponent implements OnInit {
  vehicleTypes: any[];
  availability = [{ id: 0, type: 'All' }, { id: 1, type: 'Active' }, { id: 2, type: 'Inactive' }];
  vehicles: Vehicle[];
  filteredCars: Vehicle[];
  noVehicles: boolean = false;
  total: number;

  constructor(private inventoryService: InventoryService,
    private router: Router) { }

  ngOnInit() {
    var rellaxHeader = new Rellax('.rellax-header');

    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.vehicleTypes.unshift({ id: 0, type: 'All' });
    });

    this.inventoryService.getVehicles().subscribe((data: any[]) => {
      this.vehicles = data;
      this.filteredCars = this.vehicles;
      this.total = this.vehicles.length;
      if (this.vehicles.length === 0) {
        this.noVehicles = true;
      }
      else {
        this.noVehicles = false;
      }
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

}
