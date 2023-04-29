import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  serviceUrl: string = '';

  constructor(private http: HttpClient) {
    this.serviceUrl = environment.BASE_URL + environment.PATH.SOCIAL_API
  }

  getGoogleLoginUrl(): Observable<any> {
    return this.http.get<any>(`${this.serviceUrl}google`);
  }

  googleLogin(body: string): Observable<any> {
    return this.http.get<any>(`${this.serviceUrl}google/callback${body}`);
  }

  getFacebookLoginUrl(): Observable<any> {
    return this.http.get<any>(`${this.serviceUrl}facebook`);
  }

  facebookLogin(body: string): Observable<any> {
    return this.http.get<any>(`${this.serviceUrl}facebook/callback${body}`);
  }
}
