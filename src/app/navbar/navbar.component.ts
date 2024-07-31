import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private auth:AuthService,private router:Router){}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
