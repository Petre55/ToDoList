import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  onSubmit() {
    // Implement your registration logic here
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Add registration logic and navigate to the next page upon successful registration
  }
}
