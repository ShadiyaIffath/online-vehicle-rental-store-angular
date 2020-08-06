import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbdModalBasic } from './modal/modal.component';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

import { ComponentsComponent } from './components.component';
import { NotificationComponent } from './notification/notification.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FleetComponent } from './fleet/fleet.component';
import { JwtInterceptor } from '../helpers/jwt.interceptor';
import { ErrorInterceptor } from '../helpers/error.interceptor';
import { ChangesGuard } from 'app/helpers/popupModal';
import { EquipmentComponent } from './equipment/equipment.component';
import { CarComponent } from './car/car.component';
import { ManageVehiclesComponent } from './manageVehicles/manage-vehicles.component';
import { RoleGuardService } from 'app/helpers/RoleGuardService';



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
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut:3000,
            closeButton:true,
            positionClass:'toast-bottom-right'
        }),
        ToastContainerModule
    ],
    declarations: [
        ComponentsComponent,
        NotificationComponent,
        NgbdModalBasic,
        RegisterComponent,
        LoginComponent,
        FleetComponent,
        EquipmentComponent,
        CarComponent,
        ManageVehiclesComponent
    ],
    exports: [ComponentsComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        ChangesGuard,
        RoleGuardService]
})
export class ComponentsModule { }
