import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  serviceUrl: string = '';

  constructor(private http: HttpClient) {
    this.serviceUrl = environment.BASE_URL + environment.PATH.CHAT_API
  }

  getChatHistory(body: any): Observable<any> {
    return this.http.post(`${this.serviceUrl}`, body);
  }

  getChatList(body: any): Observable<any> {
    return this.http.get(`${this.serviceUrl}chat_list/${body}`);
  }

  chat(body: any): Observable<any> {
    return this.http.post(`${this.serviceUrl}messages`, body);
  }
}
