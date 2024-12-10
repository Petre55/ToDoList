import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    // Implement your login logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    // Add authentication logic and navigate to the next page upon successful login
  }
}
