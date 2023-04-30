import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    serviceUrl: string = '';

    constructor(private http: HttpClient) {
        this.serviceUrl = environment.BASE_URL + environment.PATH.COMMENT_API
    }

    getAll(postId: any): Observable<any> {
        return this.http.get(`${this.serviceUrl}${postId}`);
    }

    getById(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/comment/get-by-id`, body);
    }

    save(body: any): Observable<any> {
        return this.http.post(`${this.serviceUrl}`, body);
    }

    delete(body: any): Observable<any> {
        return this.http.post(`${this.serviceUrl}delete`, body);
    }
}
