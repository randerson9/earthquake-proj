import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { IEarthquake } from '../earthquake';

@Injectable()
export class GetQuakesService {

    dataUrl = 'http://localhost:3000/api/quakedata';

    constructor(private http: HttpClient) {}

    getQuakes(): Observable<any> {
      return this.http.get(this.dataUrl);

    }
}
