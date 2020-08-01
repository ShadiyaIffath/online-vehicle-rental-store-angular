import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterVehicleComponent } from './components/registerVehicle/register-vehicle.component';
import { ChangesGuard} from './helpers/popupModal';

const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index',                component: ComponentsComponent },
    { path:'components/register',
       component: RegisterComponent,
       canDeactivate:[ChangesGuard]
    },
     { path:'components/login',      component: LoginComponent},
     { path: 'components/registerVehicle', component:RegisterVehicleComponent}
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
