import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

import { VehicleBooking } from 'app/models/VehicleBooking';
import { EquipmentBooking } from 'app/models/EquipmentBooking';
import { Booking } from 'app/models/Booking';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public bookingId = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) { }

  createBooking(booking: Booking){
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

  getAllBooking(){
    return this.http.get<any>(`${environment.apiUrl}/api/booking/all-bookings`)
    .pipe(map(res => {
      return res;
    }));
  }

  getBookingById(id: number){
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.get<any>(`${environment.apiUrl}/api/booking/get-booking`,{ headers: headers, params: params })
    .pipe(map(res => {
      return res;
    }));
  }

  deleteBooking(id: number){
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.delete<any>(`${environment.apiUrl}/api/booking/delete-booking`, { headers: headers, params: params })
      .pipe(map(data => {
      }));
  }

  updateBooking(booking: Booking){
    return this.http.patch<any>(`${environment.apiUrl}/api/booking/update-booking`,booking);
  }

  updateBookingStatus(booking: Booking){
    return this.http.patch<any>(`${environment.apiUrl}/api/booking/update-status`,booking);
  }

  selectBooking(id: number): void {
    this.bookingId.next(id);
  }

  removeSelection(): void {
    this.bookingId.next(0);
  }
}
