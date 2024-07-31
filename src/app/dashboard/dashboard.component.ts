import { Component, OnInit } from '@angular/core';
import { TripService } from '../trip.service';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trips: any[] = [];
  errorMessage: string | null = null;
  updateForm: FormGroup;
  selectedTrip: any | null = null;

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      destination: ['', Validators.required],
      description: ['', Validators.required],
      activities: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserTrips();
  }

  loadUserTrips(): void {
    const userId: string | null = this.authService.getUserId();
    if (userId) {
      this.tripService.getTripsByUserId(userId).subscribe(
        (data) => {
          if (Array.isArray(data)) {
            this.trips = data;
            this.errorMessage = null;
          } else {
            this.trips = [];
            this.errorMessage = 'Unexpected response format';
          }
        },
        (error) => {
          console.error('Error fetching user trips:', error);
          this.trips = [];
          this.errorMessage = 'Error fetching user trips';
        }
      );
    } else {
      console.error('User ID not found!');
      this.errorMessage = 'User ID not found';
    }
  }

  onSelectTrip(trip: any): void {
    this.selectedTrip = trip;
    this.updateForm.patchValue(trip);
  }

  onUpdateTrip(): void {
    if (this.updateForm.valid && this.selectedTrip) {
      this.tripService.updateTrip(this.selectedTrip.id, this.updateForm.value).subscribe(
        (response) => {
          console.log('Trip updated successfully!', response);
          this.loadUserTrips(); // Reload the trips to see the changes
          this.selectedTrip = null; // Clear the selection after update
        },
        (error) => {
          console.error('Error updating trip!', error);
          this.errorMessage = 'Error updating trip';
        }
      );
    }
  }
  onDeleteTrip(tripId: number): void {
    const userId: string | null = this.authService.getUserId();
    if (userId) {
      this.tripService.deleteTrip(userId, tripId).subscribe(
        (response) => {
          console.log('Trip deleted successfully!', response);
          this.loadUserTrips(); // Reload the trips to see the changes
        },
        (error) => {
          console.error('Error deleting trip!', error);
        }
      );
    } else {
      console.error('User ID not found!');
    }
  }

}
