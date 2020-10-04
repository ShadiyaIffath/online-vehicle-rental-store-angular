import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

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
    return this.http.get<any>(`${environment.apiUrl}/api/vehicle`)
      .pipe(map(equipment => {
        this.equipments =equipment;
        return this.equipments;
      }), shareReplay(1));
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
