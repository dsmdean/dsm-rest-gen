import { Component } from '@angular/core';

import { AuthenticationService } from './services/authentication';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'argon-dashboard-angular';

  constructor(public auth: AuthenticationService) {
    this.auth.loadUserCredentials();
  }
}
