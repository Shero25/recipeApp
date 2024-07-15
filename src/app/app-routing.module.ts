import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  { path: 'login', component:LoginComponent },
  { path: 'register', component:RegisterComponent },
  { path: 'dashboard', component:DashboardComponent },
  { path: 'homepage', component: HomepageComponent},
  { path: 'add', component: AddRecipeComponent},
  { path: 'landing', component: LandingComponent},
  { path: '', redirectTo:'/homepage',pathMatch:'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
