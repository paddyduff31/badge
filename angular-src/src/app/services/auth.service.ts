import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtHelperService  } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) {}

  registerUser(user) {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    
    return this.http.post<any>('users/register', user, {
      headers: headers
      
    })
  }

  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    return this.http.post<any>('users/authenticate', user, {
      headers: headers
      
    })
  }

  getProfile(){
    this.loadToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json').append('Authorization', this.authToken)
    return this.http.get<any>('users/profile', {
      headers: headers
      
    })
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.authToken = token;
    this.user = user

}

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken(){
    const token = localStorage.getItem('id_token')
    this.authToken = token
  }

  loggedIn(){
      this.loadToken();
                const helper = new JwtHelperService();
                return !helper.isTokenExpired(this.authToken); //False if Token is good, True if not good
  }

}
