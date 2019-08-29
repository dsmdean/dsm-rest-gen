import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  message: String;
  queryParams;

  constructor(public auth: AuthenticationService, private activeRoute: ActivatedRoute, private router: Router) {
    this.message = "Verifying...";
    this.queryParams = this.activeRoute.snapshot.queryParams;
    // const routeParams = this.activeRoute.snapshot.params;
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
    } else {
      this.auth.verifyEmail(this.queryParams.auth)
        .subscribe(data => {
          this.message = "Verified. You will be redirected soon...";
          this.router.navigate(['/login'])
        }, error => {
          this.message = "Something went wrong with the verification process. Please take a second look at the verification email.";
          console.log(error);
        });
    }
  }

}
