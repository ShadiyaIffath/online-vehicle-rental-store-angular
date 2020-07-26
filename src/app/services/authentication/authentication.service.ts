import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  @Output() userLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getEmitter(){
    return this.userLoggedIn;
  }

  login(email: string, password: string){
    return this.http.post<any>(`${environment.apiUrl}/api/account/authenticate`, { email, password },
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        responseType: 'text' as 'json'
      })
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      let value = JSON.stringify(user)
      console.log(value);
      localStorage.setItem('currentUser', JSON.stringify(value));
      this.userLoggedIn.emit(value);
      this.currentUserSubject.next(user);       
    }));
  }

  logout() {
    // remove user from local storage to log user out
    console.log('remove');
    localStorage.removeItem('currentUser');
    this.userLoggedIn.emit(null);
    this.currentUserSubject.next(null);
  }

  registerUser(user: User) {
    return this.http.post<any>(`${environment.apiUrl}/api/account/signup`, user)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  customerInfo(user: User) {
    let postData = JSON.stringify(user)
    console.log(postData);
    return this.http.post<any>(`${environment.apiUrl}/api/account/signup`, user)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
}
