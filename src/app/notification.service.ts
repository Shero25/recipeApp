import { Injectable } from '@angular/core';
import { TripService } from './trip.service';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Check for upcoming trips every hour
    interval(3600000).subscribe(() => this.checkUpcomingTrips());
  }
  
  checkUpcomingTrips(): void {
    const userId: string | null = this.authService.getUserId();
    if (userId) {
      this.tripService.getTripsByUserId(userId).subscribe((trips: any[]) => {
        const upcomingTrips = trips.filter(trip => {
          const startDate = new Date(trip.startDate);
          const today = new Date();
          const timeDiff = startDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return daysDiff > 0 && daysDiff <= 7; // Notify if the trip is within the next 7 days
        });
        if (upcomingTrips.length > 0) {
          this.showNotification(upcomingTrips);
        }
      });
    }
  }
  
  showNotification(trips: any[]): void {
    trips.forEach(trip => {
      this.snackBar.open(`Your trip to ${trip.destination} is coming up soon!`, 'Close', {
        duration: 5000,
      });
    });
  }
  }
  

