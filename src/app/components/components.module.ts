import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ComponentsComponent } from './components.component';
import { NotificationComponent } from './notification/notification.component';
import { NgbdModalBasic } from './modal/modal.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FleetComponent } from './fleet/fleet.component';
import { JwtInterceptor } from '../helpers/jwt.interceptor';
import { ErrorInterceptor } from '../helpers/error.interceptor';
import { RegisterVehicleComponent } from './registerVehicle/register-vehicle.component';

export function tokenGetter() {
    return localStorage.getItem("jwt");
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NouisliderModule,
        RouterModule,
        JwBootstrapSwitchNg2Module,
        HttpClientModule
    ],
    declarations: [
        ComponentsComponent,
        NotificationComponent,
        NgbdModalBasic,
        RegisterComponent,
        LoginComponent,
        FleetComponent,
        RegisterVehicleComponent
    ],
    exports: [ComponentsComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }]
})
export class ComponentsModule { }
