import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';

import { AuthenticationService } from 'app/services/authentication/authentication.service';

@Injectable()
export class RoleGuardService implements CanActivate {
    constructor(public router: Router,
        private authenticationService: AuthenticationService) {}
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data.expectedRole;
        const role = this.authenticationService.currentUserValue.role;
        if(this.authenticationService.currentUserValue != null && role === expectedRole){
            return true;
        }
        return false;
    }
}