import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    loading = new BehaviorSubject<boolean>(false);

    state = this.loading.asObservable();

    constructor() { }

    show() {
        this.loading.next(true);
    }

    hide() {
        this.loading.next(false);
    }
}
