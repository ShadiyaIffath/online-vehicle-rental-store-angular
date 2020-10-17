import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Equipment } from 'app/models/Equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private categories: any[];
  private equipments: any[];
  public equipmentId = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
  }

  getEquipmentCategories() {
    return this.http.get<any>(`${environment.apiUrl}/api/equipment/equipment-categories`)
      .pipe(map(types => {
        this.categories = types;
        return this.categories;
      }), shareReplay(1));
  }

  getEquipment() {
    return this.http.get<any>(`${environment.apiUrl}/api/equipment`)
      .pipe(map(equipment => {
        this.equipments =equipment;
        return this.equipments;
      }), shareReplay(1));
  }

  createEquipment(equipment: Equipment) {
    return this.http.post<any>(`${environment.apiUrl}/api/equipment/add-equipment`, equipment)
      .pipe(map(x => {
        this.equipments.push(equipment);
        console.log(x);
      }));
  }

  getEquipmentById(id: number) {
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.get<any>(`${environment.apiUrl}/api/equipment/get-equipment`, { headers: headers, params: params })
      .pipe(map(data => {
        return data;
      }));
  }

  updateEquipment(equipment: Equipment) {
    return this.http.patch<any>(`${environment.apiUrl}/api/equipment/update-equipment`, equipment)
      .pipe(map(x => {
        for (var index: number = 0; index < this.equipments.length; index++) {
          if (this.equipments[index].id == equipment.id) {
            this.equipments[index] = equipment;
            break;
          }
        }
      }))
  }

  deleteEquipment(id: number){
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.delete<any>(`${environment.apiUrl}/api/equipment/delete-equipment`, { headers: headers, params: params })
      .pipe(map(data => {
      }));
  }

  selectEquipment(id: number): void {
    this.equipmentId.next(id);
  }

  removeSelection(): void {
    this.equipmentId.next(0);
  }

  getTypeById(id: number) {
    return this.categories.filter(function (type) {
      return (type.id == id);
    })[0];
  }

}
