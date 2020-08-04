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
  private types: any[];
  private cars: any[];
  vehicleId: BehaviorSubject<number>;
  constructor(private http:HttpClient) { 
  }

  getVehicleTypes(){
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getTypes`)
    .pipe(map(types=>{
      this.types = types;
      return this.types;
    }), shareReplay({bufferSize:1, refCount: true}));
  }

  getVehicles(){
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getVehicles`)
    .pipe(map(cars =>{
      this.cars = cars;
      return this.cars;
    }), shareReplay({bufferSize:1, refCount: true}));
  }

  createVehicle(vehicle: Vehicle){
    return this.http.post<any>(`${environment.apiUrl}/api/vehicle/addVehicle`, vehicle)
    .pipe(map( x =>{
      this.cars.push(vehicle);
      console.log(x);
    }));
  }

  updateVehicle(vehicle: Vehicle){
    let car = vehicle;
    return this.http.patch<any>(`${environment.apiUrl}/api/vehicle/updateVehicle`, car)
    .pipe(map(x =>{
      for (var index: number = 0; index < this.cars.length; index++) {
        if(this.cars[index].id == vehicle.id){
          this.cars[index] =  vehicle;
          break;
        }
      }
    }))
  }

  selectVehicle(id: number):void{
    this.vehicleId = new BehaviorSubject(id);
  }

  removeSelection(): void{
    this.vehicleId = null;
  }

  getVehicleById(id:number){
    let car;
    for (var index: number = 0; index < this.cars.length; index++) {
      if(this.cars[index].id == id){
        car =  this.cars[index];
        break;
      }
    }
    return car;
  }

  getTypeById(id) {
    return this.types.filter(function (type) {
      return (type.id == id);
    })[0];
  }

}
