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
  registerFailed: boolean = false;
  
  public passwordMatchError: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('[a-zA-Z0-9_]{5,}')]],
      cpassword: ['', Validators.required]
    });

    // Subscribe to confirmPassword value changes to check password match
    this.signupForm.get('cpassword')?.valueChanges.subscribe(() => {
      this.passwordMatchError = this.signupForm.get('password')?.value !== this.signupForm.get('cpassword')?.value;
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    if (this.signupForm.valid && !this.passwordMatchError) {
      const formData = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        cpassword: this.signupForm.value.cpassword
      };

      this.authService.register(formData).subscribe(
        (response) => {
          const token = response.token;
          if (token) {
            this.authService.saveToken(token);
            console.log("Registered successfully");
            this.registerSuccess = true;
            this.registerFailed = false;

            setTimeout(() => {
              this.registerSuccess = false;
              this.router.navigate(['dashboard']);
            }, 1500);
          } else {
            console.error('Token not found in response');
            this.registerFailed = true;
            setTimeout(() => {
              this.registerFailed = false;
            }, 3000);
          }
        },
        (error) => {
          console.error('Signup failed', error);
          this.registerFailed = true;
          setTimeout(() => {
            this.registerFailed = false;
          }, 3000);
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
