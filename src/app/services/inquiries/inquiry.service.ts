import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inquiry } from 'app/models/Inquiry';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  constructor(private http: HttpClient) { }

  makeInquiry(inquiry: Inquiry) {
    return this.http.post<any>(`${environment.apiUrl}/api/inquiry/make-inquiry`, inquiry)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteInquiry(id: number) {
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.delete<any>(`${environment.apiUrl}/api/inquiry/delete-inquiry`, { headers: headers, params: params })
      .pipe(map(data => {
      }));
  }

  respondToInquiry(inquiry: Inquiry){
    return this.http.post<any>(`${environment.apiUrl}/api/inquiry/respond`, inquiry);
  }

  getAllInquiry(): any {
    return this.http.get<any>(`${environment.apiUrl}/api/inquiry/all-inquiries`)
      .pipe(map(data => {
        return data;
      }));
  }
}