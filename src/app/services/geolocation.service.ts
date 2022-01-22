import { Injectable } from '@angular/core';
import {MapsAPILoader} from "@agm/core";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private lat = 0;
  private lng = 0;

  constructor(private apiLoader: MapsAPILoader) {}

  public async getUserLocation(): Promise<string> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.apiLoader.load().then(() => {
              let geocoder = new google.maps.Geocoder;
              let latlng = {
                lat: this.lat,
                lng: this.lng
              };
              geocoder.geocode({
                'location': latlng
              }, (results) => {
                if (results[0]) {
                  console.log(results[0]);
                  resolve(results[0].address_components[3].long_name);
                } else {
                  resolve('Nie znaleziono');
                }
              })
            });
          }
        }, null, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      }
    });
  }
}
