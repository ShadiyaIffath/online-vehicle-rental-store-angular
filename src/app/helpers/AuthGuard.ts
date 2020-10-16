import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //check is token is expired
        if (this.authenticationService.isTokenExpired()) {
            // token is expired
            console.log('expired');
            this.toastr.error('Access Denied');
            this.router.navigate(['components/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        else{
            const expectedRole = route.data.expectedRole;
            const user = this.authenticationService.currentUserValue;
            if(!this.authenticationService.currentUserValue.role === expectedRole){
                // not authorized user
                this.toastr.error('Access Denied');
                this.router.navigate(['components/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            else{
                return true;
            }
        }
    }
}