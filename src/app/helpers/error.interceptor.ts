import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from "../services/authentication/authentication.service"
import {User} from "../models/User";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    //inject authentication service using the constructor
    constructor(private authenticationService:AuthenticationService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(err => {
            console.log(err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
            }
            if(err.status === 409){
                catchError(err);
            }

            const error =  err.error; //err.error.message || err.statusText;
            return throwError(error);
        }))
    }


}