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
            expectedRole: 'admin'
        }
    },
    {
        path: 'components/manage-vehicles',
        component: ManageVehiclesComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: 'admin'
        }
    },
    {
        path: 'components/manage-users',
        component: ManageUsersComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: 'admin'
        }
    },
    {
        path: 'components/booking',
        component: BookingComponent
        // canActivate: [RoleGuard],
        // data: {
        //     expectedRole: '
        // }
    },
    {
        path: 'components/car',
        component: CarComponent,
        canActivate: [AuthGuard],
        data: {
            expectedRole: 'admin'
        }
    },
    {
        path: 'components/equipment', 
        component: EquipmentComponent,
         canActivate: [AuthGuard],
        data: {
            expectedRole: 'admin'
        }
    }

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
