import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    serviceUrl: string = '';

    constructor(private http: HttpClient) {
        this.serviceUrl = environment.BASE_URL + environment.PATH.POST_API
    }

    getAll(): Observable<any> {
        return this.http.get(`${this.serviceUrl}`);
    }

    search(body: any): Observable<any> {
        return this.http.post(`${this.serviceUrl}search`, body);
    }

    getById(id: any): Observable<any> {
        return this.http.get(`${this.serviceUrl}${id}`);
    }

    getTop4ByRate(): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/post/get-by-rate`);
    }

    getAllByUserId(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/get-all-by-user-id`, body);
    }

    save(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/save`, body);
    }

    delete(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/delete`, body);
    }
}
