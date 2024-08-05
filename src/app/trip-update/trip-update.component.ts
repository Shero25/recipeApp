import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-trip-update',
  templateUrl: './trip-update.component.html',
  styleUrls: ['./trip-update.component.scss']
})
export class TripUpdateComponent implements OnInit {
  updateForm: FormGroup;
  selectedTrip: any | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private route: ActivatedRoute,
    private router: Router
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
    this.route.params.subscribe(params => {
      const tripId = params['id'];
      this.loadTripDetails(tripId);
    });
  }

  loadTripDetails(tripId: string): void {
    this.tripService.getTripsByUserId(tripId).subscribe(
      (trip) => {
        this.selectedTrip = trip;
        this.updateForm.patchValue(trip);
      },
      (error) => {
        console.error('Error loading trip details!', error);
        this.errorMessage = 'Error loading trip details';
      }
    );
  }

  onUpdateTrip(): void {
    if (this.updateForm.valid && this.selectedTrip) {
      const updatedTrip = { ...this.selectedTrip, ...this.updateForm.value };
      this.tripService.updateTrip(this.selectedTrip.id, updatedTrip).subscribe(
        (response) => {
          console.log('Trip updated successfully!', response);
          this.router.navigate(['/dashboard']); // Navigate back to the dashboard after update
        },
        (error) => {
          console.error('Error updating trip!', error);
          this.errorMessage = 'Error updating trip';
        }
      );
    } else {
      console.error('Form is invalid or no trip selected!');
    }
  }
}
