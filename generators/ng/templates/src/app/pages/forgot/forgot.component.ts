import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  email: String;
  response: {show: Boolean, type: String, message: String, data};

  constructor(public auth: AuthenticationService, private router: Router) {
    this.email = "";
    this.response = {show: false, type: '', message: '', data: null};
  }

  sendForgotEmail() {
    this.auth.forgotPassword(this.email)
      .subscribe(data => {
        this.email = "";
        this.response.show = true;
        this.response.type = "success";
        this.response.message = data.message;
      }, error => {
        console.log(error);
        this.response.show = true;
        this.response.type = "warning";
        this.response.message = JSON.parse(error._body).err.message;
        // this.response.message = 'We don\'t have an account with that email. Make sure you typed it correct.';
      });
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard'])
    }
  }

}
