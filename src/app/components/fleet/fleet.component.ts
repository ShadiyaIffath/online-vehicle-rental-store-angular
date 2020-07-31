import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { InventoryService } from '../../services/inventory/inventory.service'

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})

export class FleetComponent implements OnInit {
  vehicleTypes: any[];
  filteredTypes: any[];
  noVehicles: boolean = false;
  serviceFailed: boolean = false;
  closeResult: string;

  constructor(private inventoryService: InventoryService,
    private modalService: NgbModal) {
    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.serviceFailed = false;
      if (this.vehicleTypes.length === 0) {
        this.noVehicles = true;
      }
      else {  
        this.noVehicles = false;
      }
    },
    (error)=>{ 
      this.serviceFailed = true;
    });
    this.filteredTypes = this.vehicleTypes;
  }

  ngOnInit(): void {
  }

  typeChecked(): void {
    this.filteredTypes.filter(item => { return item.checked; });
  }

  filteredInventory() {
    this.typeChecked();
    return this.filteredTypes;
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'modal-mini modal-primary', size: 'sm' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
}

