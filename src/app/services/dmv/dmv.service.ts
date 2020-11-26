import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DmvService {
  private dmv: any[];
  constructor(private http: HttpClient) {}

  getDMV() {
    return this.http.get<any>(`${environment.apiUrl}/api/dmv/get-dmv`)
      .pipe(map(dmvs => {
        this.dmv = dmvs;
        return this.dmv;
      }), shareReplay(1));
  }

  validateLicense(licenseId: string, accountId: number){
    const formData = new FormData();
    formData.append("drivingLicense", licenseId);
    formData.append("id", accountId.toString());
    return this.http.post<any>(`${environment.apiUrl}/api/dmv/validate-license`, formData);
  }
}
