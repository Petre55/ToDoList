import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {TodosComponent} from './todos/todos.component';
import {RegisterComponent} from './register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path:'register',component: RegisterComponent},
  { path: 'main', component: TodosComponent } // Updated to MainComponent
];
