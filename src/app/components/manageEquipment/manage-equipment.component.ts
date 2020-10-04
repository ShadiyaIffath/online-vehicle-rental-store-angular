import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Equipment } from 'app/models/Equipment';
import { EquipmentCategory } from 'app/models/EquipmentCategory';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-equipment',
  templateUrl: './manage-equipment.component.html',
  styleUrls: ['./manage-equipment.component.css']
})
export class ManageEquipmentComponent implements OnInit {
  equipment: Equipment[];
  filteredEquipment:  Equipment[];
  categories: any[];
  noEquipment: boolean = false;
  total: number;

  constructor(private equipmentService: EquipmentService,
    private router: Router, 
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.equipmentService.getEquipmentCategories().subscribe((data: any[]) => {
      this.categories = data;
      this.categories.unshift({ id: 0, title: 'All' });
    });

    this.equipmentService.getEquipment().subscribe((data: any[]) => {
      this.equipment = data;
      this.filteredEquipment = this.equipment;
      this.total = this.filteredEquipment.length;
      if (this.equipment.length === 0) {
        this.noEquipment = true;
      }
      else {
        this.noEquipment = false;
      }
      this.spinner.hide();
    });
  }

  categoryFilter(event: any){
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredEquipment = this.equipment;
    }
    else {
      this.filteredEquipment = this.equipment.filter(function (equipment) {
        return equipment.category.title === filter;
      });
    }
  }
}
