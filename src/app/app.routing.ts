import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/AuthGuard';
import { ChangesGuard } from './helpers/popupModal';

import { ComponentsComponent } from './components/components.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CarComponent } from './components/car/car.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { ManageVehiclesComponent } from './components/manageVehicles/manage-vehicles.component';
import { RoleGuardService as RoleGuard } from './helpers/RoleGuardService';
import { BookingComponent } from './components/booking/booking.component';
import { ManageEquipmentComponent } from './components/manageEquipment/manage-equipment.component';
import { ManageUsersComponent } from './components/manageUsers/manage-users.component';
import { ManageBookingComponent } from './components/manageBookings/manage-booking.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HelpComponent } from './components/help/help.component';
import { ManageInquiriesComponent } from './components/manageInquiries/manage-inquiries.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DmvComponent } from './components/dmv/dmv.component';
import { CompetitorsComponent } from './components/competitors/competitors.component';
import { FraudsComponent } from './components/frauds/frauds.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: ComponentsComponent },
    { path: 'components/register', component: RegisterComponent },
    { path: 'components/login', component: LoginComponent },
    {
        path: 'components/manage-equipment',
        component: ManageEquipmentComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/manage-vehicles',
        component: ManageVehiclesComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/manage-users',
        component: ManageUsersComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/manage-bookings',
        component: ManageBookingComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin','customer']
        }
    },
    {
        path: 'components/booking',
        component: BookingComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin','customer']
        }
    },
    {
        path: 'components/profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin','customer']
        }
    },
    {
        path: 'components/car',
        component: CarComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/help',
        component: HelpComponent,
    },
    {
        path: 'components/equipment', 
        component: EquipmentComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/manage-inquiries', 
        component: ManageInquiriesComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/dashboard', 
        component: DashboardComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/dmv', 
        component: DmvComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    }, {
        path: 'components/competitors', 
        component: CompetitorsComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'components/frauds', 
        component: FraudsComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: ['admin']
        }
    },


];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
