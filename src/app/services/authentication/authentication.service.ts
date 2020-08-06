import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../models/User';
import { TokenClaim } from 'app/models/TokenClaims';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  @Output() userLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  private currentUserSubject: BehaviorSubject<TokenClaim>;
  public currentUser: Observable<TokenClaim>;

  constructor(private http: HttpClient,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<TokenClaim>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): TokenClaim {
    return this.currentUserSubject.value;
  }

  public getEmitter() {
    return this.userLoggedIn;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/account/authenticate`, { email, password },
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        responseType: 'text' as 'json'
      })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        let jwtData = atob(user.split('.')[1]);
        let token = JSON.parse(jwtData);
        token.token = user;
        
        localStorage.setItem('currentUser', JSON.stringify(token));
        this.userLoggedIn.emit(token);
        this.currentUserSubject.next(token);
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.userLoggedIn.emit(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/components/login']);
  }

  registerUser(user: User) {
    return this.http.post<any>(`${environment.apiUrl}/api/account/signup`, user)
      .pipe(map(user => {
        return user;
      }));
  }
}
