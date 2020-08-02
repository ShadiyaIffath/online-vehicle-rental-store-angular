import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ChangesGuard} from './helpers/popupModal';
import { CarComponent } from './components/car/car.component';
import { EquipmentComponent } from './components/equipment/equipment.component';

const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index',                component: ComponentsComponent },
    { path:'components/register', component: RegisterComponent},
     { path:'components/login',      component: LoginComponent},
     { path: 'components/car', component:CarComponent},
     { path: 'components/equipment', component:EquipmentComponent}

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
