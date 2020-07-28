import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

import {InventoryService} from '../../services/inventory/inventory.service'
import {VehicleType} from '../../models/VehicleType';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})

export class FleetComponent implements OnInit {
  vehicleTypes: any [];
  filteredTypes: any[];

  constructor(private inventoryService: InventoryService) {
    this.inventoryService.getVehicleTypes().subscribe((data: any[])=>{
      console.log(data);
      this.vehicleTypes = data;
    });
    this.filteredTypes = this.vehicleTypes;
   }

  ngOnInit(): void {
  }

  typeChecked() : void{
    this.filteredTypes.filter(item=> { return item.checked;} );
  }
  
  filteredInventory(){
    this.typeChecked();
    return this.filteredTypes;
  }
}

