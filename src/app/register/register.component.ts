import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public signupForm: FormGroup;
  registerSuccess: boolean = false;
  RegisterFailed: boolean = false;
  
  public passwordMatchError: boolean = false; // Flag to track password match error

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router:Router) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9_]{5,}')]],
      confirmPassword: ['', Validators.required],
    });

    // Subscribe to confirmPassword value changes to check password match
    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.passwordMatchError = this.signupForm.get('password')?.value !== this.signupForm.get('confirmPassword')?.value;
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        confirmPassword: this.signupForm.value.confirmPassword, // Corrected property name to match AuthService
      };

      this.authService.register(formData).subscribe(
        (response) => {
          const token = response.token;
          if (token) {
            this.authService.saveToken(token);
            console.log("Registered sucessfully") // Save token to localStorage
            this.registerSuccess = true; // Set loginSuccess to true on successful login
            this.RegisterFailed = false;

            // Hide the success message and navigate after 30 seconds
            setTimeout(() => {
              this.registerSuccess = false;
              this.router.navigate(['questionnare/:id']); // Navigate to home page
            },1500); // Navigate to home page
          } else {
            console.error('Token not found in response');
          }
        },
        (error) => {
          console.error('Signup failed', error);
          this.RegisterFailed = true;
          // Hide the failure message after 30 seconds
          setTimeout(() => {
            this.RegisterFailed = false;
          }, 3000);
          // Handle error, show error message to user
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

}