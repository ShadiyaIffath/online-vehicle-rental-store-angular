import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  token: string;
  menuItems: any[];
  showFiller = false;
  sidebarVisible: boolean;

  constructor(private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {
    if (this.authenticationService.currentUserValue.role == 'admin') {
      this.token = this.authenticationService.currentUserValue.token;
    }
  }

  ngOnInit() {
    this.authenticationService.getEmitter().subscribe((customObject) => {
      if (!this.authenticationService.isTokenExpired()) {
        if (customObject != null) {
          if (customObject.role == 'admin') {
            this.token = this.authenticationService.currentUserValue.token;
          }
        }
      }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.token = '';
    this.toastr.success('Logged out', 'Successful');
  }
}
