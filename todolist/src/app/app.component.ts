import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Item } from "./item";
import { ItemComponent } from "./item/item.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
})

export class AppComponent {

}
