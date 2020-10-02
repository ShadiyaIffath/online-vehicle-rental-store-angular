import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

import { Booking } from 'app/models/VehicleBooking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  createBooking(booking: Booking){
    console.log(JSON.stringify(booking));
    return this.http.post<any>(`${environment.apiUrl}/api/booking/createBooking`,booking);
  }
}
