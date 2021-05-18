import { Component, OnInit } from '@angular/core';
import { FraudClaim } from 'app/models/FraudClaims';
import { User } from 'app/models/User';
import { FraudService } from 'app/services/fraud/fraud.service';
import { UsersService } from 'app/services/users/users.service';
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

  constructor(private userService: UsersService,
    private fraudLicenseService: FraudService,
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

  updateUserStatus(selected: User) {
    let user = selected;
    this.userService.updateStatus(selected).subscribe(x => {
      this.toastr.success('User status updated.', 'Successful');
    }, err => {
      console.log(err);
      this.toastr.error('Status update failed', 'Failed');
    });
  }
}
