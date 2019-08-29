import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  user: { password, cpassword };
  response: { show: Boolean, type: String, message: String, data };
  queryParams;

  constructor(public auth: AuthenticationService, private activeRoute: ActivatedRoute, private router: Router) {
    this.user = { password: '', cpassword: '' };
    this.response = { show: false, type: '', message: '', data: null };
    this.queryParams = this.activeRoute.snapshot.queryParams;
  }

  confirmReset() {
    if (this.user.password !== this.user.cpassword) {
      this.resetPassword();
      this.response.show = true;
      this.response.type = "warning";
      this.response.message = "Passwords do not match!";
    } else {
      this.doReset();
    }
  }

  doReset() {
    this.auth.resetPassword(this.user.password)
      .subscribe(data => {
        this.resetPassword();
        this.response.show = true;
        this.response.type = "success";
        this.response.message = data.status;
      }, error => {
        console.log(error);
        this.resetPassword();
        this.response.show = true;
        this.response.type = "warning";
        this.response.message = "Your password reset link is expired.";
      });
  }

  resetPassword() {
    this.user.password = '';
    this.user.cpassword = '';
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

}
