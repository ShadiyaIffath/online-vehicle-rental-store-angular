import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { NgxSpinnerModule } from "ngx-spinner";
import {NgxPaginationModule} from 'ngx-pagination';

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
import { BookingComponent } from './booking/booking.component';
import { ManageEquipmentComponent } from './manageEquipment/manage-equipment.component';
import { ManageUsersComponent } from './manageUsers/manage-users.component';
import { MaterialModule } from 'app/shared/Material/material.module';
import { ManageBookingComponent } from './manageBookings/manage-booking.component';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { ManageInquiriesComponent } from './manageInquiries/manage-inquiries.component';
import { FilterVehiclePipe } from 'app/pipes/vehicleFilterPipe';
import { FilterVehicleTypePipe } from 'app/pipes/vehicleTypeFilterPipe';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';

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
        NgxPaginationModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-bottom-right'
        }),
        ToastContainerModule,
        NgxSpinnerModule,
        MaterialModule,
        MatButtonModule,
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
        ManageVehiclesComponent,
        BookingComponent,
        ManageEquipmentComponent,
        ManageUsersComponent,
        ManageBookingComponent,
        ProfileComponent,
        HelpComponent,
        ManageInquiriesComponent,
        FilterVehiclePipe,
        FilterVehicleTypePipe,
        DashboardComponent,
    ],
    exports: [ComponentsComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        ChangesGuard,
        RoleGuardService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
