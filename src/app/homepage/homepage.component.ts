import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../trip.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  tripForm: FormGroup;
  selectedFile: File | null = null;
  Added: boolean = false;

  constructor(private fb: FormBuilder, private tripService: TripService, private auth:AuthService) {
    this.tripForm = this.fb.group({
      destination: ['', Validators.required],
      description: ['', Validators.required],
      activities: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // onFileChange(event: any): void {
  //   this.selectedFile = event.target.files[0] || null;
  // }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const userId = this.auth.getUserId();
      if (userId) {
        const data = {
          ...this.tripForm.value,
          userId: userId
        };

        this.tripService.addTrip(data).subscribe(response => {
          console.log('Trip added successfully!', response);
          this.Added = true;
        }, error => {
          console.error('Error adding trip!', error);
        });
      } else {
        console.error('User ID not found!');
      }
    }
  }
}
  

