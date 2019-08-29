import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: { username, password };
  error: {show: Boolean, message: String, data};

  constructor(public auth: AuthenticationService, private router: Router) {
    this.user = {
      username: '',
      password: ''
    };
    this.error = {show: false, message: '', data: null};
  }

  doLogin() {
    this.auth.login(this.user)
      .subscribe(data => {
        this.auth.setTokenExp('');
        data.user.token = data.token;
        this.auth.storeUserCredentials(data.user, data.tokenExp);
        // console.log(data);
        this.router.navigate(['/dashboard']);
      }, error => {
        this.error.show = true;
        this.error.message = JSON.parse(error._body).err.message;
        console.log(JSON.parse(error._body));
      });
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
  ngOnDestroy() {
  }

}
