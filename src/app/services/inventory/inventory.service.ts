import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {Vehicle} from '../../models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:HttpClient) { }

  getVehicleTypes(){
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getTypes`)
    .pipe(map(types=>{
      return types;
    }), shareReplay({bufferSize:1, refCount: true}));
  }

  getVehicles(){
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getVehicles`)
    .pipe(map(cars =>{
      return cars;
    }), shareReplay({bufferSize:1, refCount: true}));
  }

  createVehicle(vehicle: Vehicle){
    return this.http.post<any>(`${environment.apiUrl}/api/vehicle/addVehicle`, vehicle)
    .pipe(map( x =>{
      console.log(x);
    }));
  }
}
