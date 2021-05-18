import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FraudService {

  constructor(private http: HttpClient) {}

  getFraudLicense() {
    return this.http.get<any>(`${environment.apiUrl}/api/insurance/frauds`)
      .pipe(map(data => {
        return data;
      }), shareReplay(1));
  }

  validateLicense(drivingLicense: string){
    const formData = new FormData();
    formData.append("drivingLicense", JSON.stringify(drivingLicense));
    return this.http.post<any>(`${environment.apiUrl}/api/insurance/validate-fraud`, formData);
  }
}
