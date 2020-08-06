import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ChangesGuard } from './helpers/popupModal';
import { CarComponent } from './components/car/car.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { ManageVehiclesComponent } from './components/manageVehicles/manage-vehicles.component';
import { AuthGuard } from './helpers/AuthGuard';
import { RoleGuardService as RoleGuard } from './helpers/RoleGuardService';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: ComponentsComponent },
    { path: 'components/register', component: RegisterComponent },
    { path: 'components/login', component: LoginComponent },
    {
        path: 'components/manageVehicles',
        component: ManageVehiclesComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'admin'
        }
    },
    {
        path: 'components/car',
        component: CarComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: 'admin'
        }
    },
    {
        path: 'components/equipment', 
        component: EquipmentComponent,
         canActivate: [RoleGuard],
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
