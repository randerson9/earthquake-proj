import { Component, OnInit } from '@angular/core';
declare let L;
import '../../node_modules/loader-runner/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// console.log('hello');
export class AppComponent implements OnInit {
  // dataUrl = 'http://echo.jsontest.com/key/value/one/two';
  dataUrl = '../assets/data/testquake.json';
  // dataUrl = '../assets/data/quakedata.json';
  // private http: HttpClient;
  constructor(private http: HttpClient) {
    this.http.get(this.dataUrl).toPromise().then(data => {
      console.log(data);
    });
  }

  ngOnInit() {
    const myMap = L.map('map').setView([39.585, -103.46], 5);
    // myMap.setMaxBounds(myMap.getBounds()); // remove later to avoid map "bouncing back"

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 8
    }).addTo(myMap);

    // const circle = L.circle([51.508, -0.11], { // format lat, lon -28.6292, -177.0002
    const circle = L.circle([-28.6292, 177.0002], { // format lat, lon -28.6292, -177.0002

      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 95000
    }).addTo(myMap);

    this.http.get(this.dataUrl).toPromise().then(data => {
       console.log(typeof data.coordinates);
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0;  i < data.features.length; i++) {
           console.log(data.features[i].properties.mag);
           console.log(data.features[i].properties.place);
           console.log(data.features[i].geometry.coordinates[1] + ', ' + data.features[i].geometry.coordinates[0]);
           console.log('   ');
           const coords = [];
           coords[1] = data.features[i].geometry.coordinates[0];
           coords[0] = data.features[i].geometry.coordinates[1];
           // coords[2] = data.features[i].geometry.coordinates[2];

           const newCircle = L.circle(coords, {
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.5,
              radius: 50000
           }).addTo(myMap);
    }

       console.log('THIS IS FUCKING RUNNING');
    });
  }



}
