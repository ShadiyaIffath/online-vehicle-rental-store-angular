import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/models/User';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(`${environment.apiUrl}/api/account/get-accounts`)
      .pipe(map(users => {
        return users;
      }));
  }

  getAccountDetails(id: number) {
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.get<any>(`${environment.apiUrl}/api/account/get-account`, { headers: headers, params: params })
      .pipe(map(acc => {
        return acc;
      }));
  }

  deleteUser(id: number) {
    let index = id.toString();
    const params = new HttpParams().set('id', index);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.delete<any>(`${environment.apiUrl}/api/account/delete-account`, { headers: headers, params: params })
      .pipe(map(data => {
      }));
  }

  updateStatus(user: User) {
    user.active = !user.active;
    return this.http.patch<any>(`${environment.apiUrl}/api/account/update-account-status`, user)
      .pipe(map(data => {
      }));
  }

  updateAccount(user: User) {
    return this.http.patch<any>(`${environment.apiUrl}/api/account/update-account`, user)
      .pipe(map(data => {
      }));
  }

  requestPasswordUpdate(user: any) {
    var headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<any>(`${environment.apiUrl}/api/account/request-change`,user, {responseType: 'text' as 'json' } );
  }

  updateAccountPassword(user: any){
    return this.http.patch<any>(`${environment.apiUrl}/api/account/update-password`, user)
      .pipe(map(data => {
      }));
  }
}
