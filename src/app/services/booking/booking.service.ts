import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

import { VehicleBooking } from 'app/models/VehicleBooking';
import { EquipmentBooking } from 'app/models/EquipmentBooking';
import { Booking } from 'app/models/Booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  createBooking(booking: Booking){
    console.log(JSON.stringify(booking));
    return this.http.post<any>(`${environment.apiUrl}/api/booking/create-booking`,booking);
  }

  validateBooking(booking: VehicleBooking){
    return this.http.post<any>(`${environment.apiUrl}/api/booking/validate-booking`, booking)
    .pipe(map(res => {
      return res;
    }));
  }

  getAvailableEquipment(booking: VehicleBooking){
    return this.http.post<any>(`${environment.apiUrl}/api/booking/get-available-equipment`, booking)
    .pipe(map(res => {
      return res;
    }));
  }
}
