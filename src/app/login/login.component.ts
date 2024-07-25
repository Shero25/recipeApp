import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  signinForm: FormGroup;
  loginSuccess: boolean = false;
  loginFailed: boolean = false;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signinForm.valid) {
      const formData = {
        email: this.signinForm.value.email,
        password: this.signinForm.value.password
      };
      
      this.auth.login(formData).subscribe(
        (response) => {
          const token = response.token;
          if (token) {
            this.auth.saveToken(token);
            const userId = this.auth.getUserId(); // Extract user ID from token
            console.log('User ID:', userId);
            this.auth.saveToken(token);
            console.log(token);
            
            this.loginSuccess = true; // Set loginSuccess to true on successful login
            this.loginFailed = false;
            console.log("logged in");

            // Hide the success message and navigate after 1.5 seconds
            setTimeout(() => {
              this.loginSuccess = false;
              this.router.navigate(['/home']); // Navigate to home page
            }, 1500);
          } else {
            console.error('Token not found in response');
            this.loginFailed = true;
            // Hide the failure message after 3 seconds
            setTimeout(() => {
              this.loginFailed = false;
            }, 3000);
          }
        },
        (error) => {
          console.error('Login failed', error);
          this.loginFailed = true;
          // Hide the failure message after 3 seconds
          setTimeout(() => {
            this.loginFailed = false;
          }, 3000);
        }
      );
    } else {
      this.markFormGroupTouched(this.signinForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


}
