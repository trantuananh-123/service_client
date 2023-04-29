import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  serviceUrl: string = '';

  constructor(private http: HttpClient) {
    this.serviceUrl = environment.BASE_URL + environment.PATH.PAYMENT_API
  }

  payRedirect(body: any): Observable<any> {
    return this.http.post<any>(`${this.serviceUrl}payRedirect`, body);
  }

  pay(body: string): Observable<any> {
    return this.http.get<any>(`${this.serviceUrl}success${body}`);
  }
}
