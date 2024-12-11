import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { UserInterface } from "./use.interface"
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user$.subscribe((user: UserInterface | null) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          displayName: user.displayName!
        });
        console.log('User:', user);
      } else {
        this.authService.currentUserSig.set(null);
        console.log('No user logged in');
      }
      console.log('Current User Signal Value:', this.authService.currentUserSig());
    });
  }
  constructor(private router: Router) {}

logout(): void {
  this.authService.logout().then(() => {
    this.router.navigate(['/login']);
  }).catch((error) => {
    console.error('Logout failed', error);
  });
}

}
