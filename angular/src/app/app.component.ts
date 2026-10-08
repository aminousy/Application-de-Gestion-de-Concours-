import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Notifications } from './composants-partages/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Notifications],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly titre = 'SunuXam';
}
