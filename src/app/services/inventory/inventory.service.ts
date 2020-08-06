import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Vehicle } from '../../models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private types: any[];
  private cars: any[];
  vehicleId: BehaviorSubject<number>;
  constructor(private http: HttpClient) {
  }

  getVehicleTypes() {
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getTypes`)
      .pipe(map(types => {
        this.types = types;
        return this.types;
      }), shareReplay({ bufferSize: 1, refCount: true }));
  }

  getVehicles() {
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getVehicles`)
      .pipe(map(cars => {
        this.cars = cars;
        return this.cars;
      }), shareReplay({ bufferSize: 1, refCount: true }));
  }

  // getVehicleById(id: number) {
  //   let index = id.toString();
  //   const params = new HttpParams().set('id', index);
  //   const headers = new HttpHeaders().set('content-type', 'application/json');
  //   return this.http.get<any>(`${environment.apiUrl}/api/vehicle/getVehicle`, { headers: headers, params: params })
  //     .pipe(map(car => {
  //       return car;
  //     }));
  // }

  createVehicle(vehicle: Vehicle) {
    return this.http.post<any>(`${environment.apiUrl}/api/vehicle/addVehicle`, vehicle)
      .pipe(map(x => {
        this.cars.push(vehicle);
        console.log(x);
      }));
  }

  updateVehicle(vehicle: Vehicle) {
    return this.http.patch<any>(`${environment.apiUrl}/api/vehicle/updateVehicle`, vehicle)
      .pipe(map(x => {
        for (var index: number = 0; index < this.cars.length; index++) {
          if (this.cars[index].id == vehicle.id) {
            this.cars[index] = vehicle;
            break;
          }
        }
      }))
  }

  updateVehicleStatus(vehicle: Vehicle) {
    return this.http.post<any>(`${environment.apiUrl}/api/vehicle/updateVehicleStatus`,
      { id: vehicle.id, active: vehicle.active, dayRemoved: vehicle.dayRemoved }, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: 'text' as 'json'
    })
      .pipe(map(x => {
        for (var index: number = 0; index < this.cars.length; index++) {
          if (this.cars[index].id == vehicle.id) {
            this.cars[index] = vehicle;
            break;
          }
        }
      }))
  }

  selectVehicle(id: number): void {
    this.vehicleId = new BehaviorSubject(id);
  }

  removeSelection(): void {
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

  getTypeById(id: number) {
    return this.types.filter(function (type) {
      return (type.id == id);
    })[0];
  }

}
