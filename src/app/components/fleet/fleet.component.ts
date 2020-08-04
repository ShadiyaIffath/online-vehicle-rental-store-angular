import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { InventoryService } from '../../services/inventory/inventory.service'
import { Vehicle } from 'app/models/Vehicle';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})

export class FleetComponent implements OnInit {
  vehicleTypes: any[];
  vehicles: Vehicle[];
  filteredCars: Vehicle[];
  noVehicles: boolean = false;
  serviceFailed: boolean = false;
  closeResult: string;

  constructor(private inventoryService: InventoryService,
    private modalService: NgbModal) {    
  }

  ngOnInit(): void {
    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.serviceFailed = false;
    },
    (error)=>{ 
      this.serviceFailed = true;
    });
    this.inventoryService.getVehicles().subscribe((data: any[]) =>{
      this.vehicles = data;
      this.filteredCars = this.vehicles;

      if (this.vehicles.length === 0) {
        this.noVehicles = true;
      }
      else {  
        this.noVehicles = false;
      }
    });
  }

  typeChecked(): void {
    //this.filteredCars.filter(item => { return item.checked; });
  }

  filteredInventory() {
    this.typeChecked();
    return this.filteredCars;
  }
}

