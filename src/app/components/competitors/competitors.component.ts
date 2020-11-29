import { Component, OnInit } from '@angular/core';
import { CarRating } from 'app/models/CarRating';
import { InventoryService } from 'app/services/inventory/inventory.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-competitors',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.css']
})
export class CompetitorsComponent implements OnInit {
  competitor: CarRating[];
  allCompetitors : CarRating[];
  vehicleTypes: any[] = ["All","General Cars", "Premium Cars", "Luxury Cars", "Vans", "SUV & 4WD"];
  noCompetitors: boolean = false;

  constructor(private inventoryService: InventoryService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.inventoryService.getCompetitorData().subscribe((data: any[]) => {
      this.competitor = data;
      this.allCompetitors = data;
      this.noCompetitors = this.competitor.length == 0 ? true: false;
      this.spinner.hide();
    }, error=>{
      this.toastr.error("Server error, try again later");
      this.spinner.hide();
    });
  }

  typeFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.competitor = this.allCompetitors;
    }
    else {
      filter = filter.toUpperCase();
      this.competitor = this.allCompetitors.filter(function (car) {
        return car.CarCategory === filter;
      });
    }
    this.noCompetitorsTag();
  }

  noCompetitorsTag() {
    if (this.competitor.length == 0) {
      this.noCompetitors = true;
    }
    else {
      this.noCompetitors = false;
    }
  }

}
