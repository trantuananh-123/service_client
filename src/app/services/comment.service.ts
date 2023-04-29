import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) { }

    getAll(postId: any): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/comment/get-all/${postId}`);
    }

    getById(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/comment/get-by-id`, body);
    }

    save(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/comment/save`, body);
    }

    delete(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/comment/delete`, body);
    }
}
