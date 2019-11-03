import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MessageService {
    private notify = new Subject<any>();

    notifyObservable$ = this.notify.asObservable();
    constructor() {}

    public notifyOther(data: any) {
      if (data) {
        this.notify.next(data);
      }
    }

}
