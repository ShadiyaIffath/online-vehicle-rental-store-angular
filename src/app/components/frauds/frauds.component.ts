import { Component, OnInit } from '@angular/core';
import { FraudClaim } from 'app/models/FraudClaims';
import { FraudService } from 'app/services/fraud/fraud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-frauds',
  templateUrl: './frauds.component.html',
  styleUrls: ['./frauds.component.css']
})
export class FraudsComponent implements OnInit {
  fraudClaims: FraudClaim[];
  noClaims: boolean = false;
  total : number = 0;

  constructor(private fraudLicenseService: FraudService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.fraudLicenseService.getFraudLicense().subscribe((data: any[]) => {
      this.fraudClaims = data;
      this.noClaims = this.fraudClaims.length == 0 ? true: false;
      this.total = this.fraudClaims.length;
      this.spinner.hide();
    }, error=>{
      this.toastr.error("Server error, try again later");
      this.spinner.hide();
    });
  }
}
