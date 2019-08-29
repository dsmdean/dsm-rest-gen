import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: { name, email, password, cpassword };
  response: {show: Boolean, type: String, message: String, data};

  constructor(public auth: AuthenticationService) {
    this.user = {name: '', email: '', password: '', cpassword: ''};
    this.response = {show: false, type: '', message: '', data: null};
  }

  confirmRegister() {
    if(this.user.password !== this.user.cpassword) {
      this.resetPassword();
      this.response.show = true;
      this.response.type = "warning";
      this.response.message = "Passwords do not match!";
    } else {
      this.doRegister();
    }
  }

  doRegister() {
    this.auth.register(this.user)
      .subscribe(data => {
        this.user = {name: '', email: '', password: '', cpassword: ''};
        this.response.show = true;
        this.response.type = "success";
        this.response.message = data.message;
        return data;
      }, error => {
        this.resetPassword();
        this.response.show = true;
        this.response.type = "warning";
        this.response.message = JSON.parse(error._body).err.message;
        console.log(error);
      });
  }

  resetPassword() {
    this.user.password = '';
    this.user.cpassword= '';
  }

  ngOnInit() {
  }

}
