import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    }))
  }
}
