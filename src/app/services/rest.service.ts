import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SpeedTestData} from "../models/speed-test-data";

@Injectable({
  providedIn: 'root'
})
export class RestService {
  public currentUserId: string;
  public userEmail: string;
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {
    this.currentUserId = localStorage.getItem('userId');
    this.userEmail = localStorage.getItem('userEmail');
  }

  public login(userMail: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + '/users/login', {userMail, password}, {
      headers: {
        'Authorization': 'Basic ' + btoa(userMail + ':' + password)
      },
      withCredentials: true
    });
  }

  public register(userMail: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + '/users/register', {userMail, password}, {
      withCredentials: true
    });
  }

  public logout(): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + '/users/logout', {}, {
      withCredentials: true
    });
  }

  public changeEmail(newMail: string): Observable<any> {
    return this.httpClient.put<any>(this.apiUrl + '/users/modify/mail', {newMail}, {
      withCredentials: true
    });
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.put<any>(this.apiUrl + '/users/modify/password', {oldPassword, newPassword}, {
      withCredentials: true
    });
  }

  public getSpeedTestHistory(): Observable<SpeedTestData[]> {
    return this.httpClient.get<SpeedTestData[]>(this.apiUrl + '/results/user', {
      withCredentials: true
    });
  }

  public addSpeedTestToHistory(speedTestData: SpeedTestData): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + '/results/add', speedTestData, {
      withCredentials: true
    });
  }
}
