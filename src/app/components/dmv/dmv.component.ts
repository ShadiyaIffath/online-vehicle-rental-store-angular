import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DMV } from 'app/models/DMV';
import { DmvService } from 'app/services/dmv/dmv.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dmv',
  templateUrl: './dmv.component.html',
  styleUrls: ['./dmv.component.css']
})
export class DmvComponent implements OnInit {
  status = [{ id: 0, type: 'All' }, { id: 1, type: 'Lost' }, { id: 2, type: 'Suspended' }];
  dmv: DMV[];
  filteredDMV: DMV[];
  noDMV: boolean = false;
  total: number = 0;

  constructor(private dmvService: DmvService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.dmvService.getDMV().subscribe((data: any[]) => {
      this.dmv = data;
      this.filteredDMV = data;
      this.total = this.dmv.length;
      this.noDMVTag();
      this.spinner.hide();
    });
  }

  noDMVTag() {
    if (this.filteredDMV.length == 0) {
      this.noDMV = true;
    }
    else {
      this.noDMV = false;
    }
  }

  activeFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredDMV = this.dmv;
    }
    else {
      this.filteredDMV = this.dmv.filter(function (i) {
        return i.type == filter;
      });
    }
    this.noDMVTag();
  }

}