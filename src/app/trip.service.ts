import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl = 'http://localhost:8080/api/v1/auth/travel';

  constructor(private http: HttpClient) {}

  addTrip(trip: any): Observable<any> {
    const userId = trip.userId;
    const url = `${this.baseUrl}?userId=${userId}`;
    return this.http.post(url, trip);
  }

  getTripsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/userInfo/users/${userId}`);
  }

  updateTrip(tripId: number, trip: any): Observable<any> {
    const url = `${this.baseUrl}/userInfo/${tripId}`;
    return this.http.put(url, trip);
  }

  
  deleteTrip(userId: string, tripId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${userId}/${tripId}`);
  }
}
