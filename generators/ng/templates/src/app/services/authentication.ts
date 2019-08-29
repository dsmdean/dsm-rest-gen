import { Http, Headers, RequestOptions } from '@angular/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
// import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { EnvService } from './env';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  env: { url };
  TOKEN_KEY = 'Token';
  TOKEN_EXP = 'TokenExp';
  authenticated: Boolean;
  user: {};
  authToken: string;
  headers: any;
  tokenExp: Date;
  checkExp: any;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, public http: Http, private EnvService: EnvService) {
    this.env = EnvService.getEnv();
    // this.loadUserCredentials();
  }

  stopInterval() {
    clearInterval(this.checkExp);
  }

  useCredentials(credentials, expiration) {
    this.authenticated = true;
    this.user = credentials;
    // console.log("Use Credentials");

    this.authToken = credentials.token;
    this.setHeaders(this.authToken);
    // console.log('Use Credentials');

    if (typeof expiration != "undefined") {
      this.tokenExp = expiration;

      this.checkExp = setInterval(() => {
        if (new Date(Date.now()) >= new Date(this.tokenExp)) {
          // console.log('Expired!');
          this.logout();
          this.stopInterval();
        } else {
          // console.log('Not Expired!');
        }
      }, 60000);

      // this.events.publish('login:successful');
    }
  }

  loadUserCredentials() {
    let credentials;
    let expiration;

    credentials = this.storage.get(this.TOKEN_KEY);
    expiration = this.storage.get(this.TOKEN_EXP);

    if (credentials != null && expiration != null) {
      this.useCredentials(credentials, expiration);
    }

    // this.storage.get(this.TOKEN_KEY).then((cred) => {
    //   credentials = cred;

    //   this.storage.get(this.TOKEN_EXP).then((exp) => {
    //     expiration = exp;

    //     if (credentials !== null && expiration !== null) {
    //       this.useCredentials(credentials, expiration);
    //     }
    //   });
    // });
  }

  storeUserCredentials(credentials, expiration) {
    delete credentials.hash;
    delete credentials.salt;
    // console.log('Store Credentials');

    if (typeof expiration === "undefined") {
      this.storage.set(this.TOKEN_KEY, credentials);
      this.useCredentials(credentials, undefined);
    } else {
      this.storage.set(this.TOKEN_KEY, credentials);
      this.storage.set(this.TOKEN_EXP, expiration);
      this.useCredentials(credentials, expiration);
    }
  }

  destroyUserCredentials() {
    // console.log('Destroy Credentials');
    this.authToken = undefined;
    this.tokenExp = undefined;
    this.user = {};
    this.authenticated = false;
    this.setHeaders(this.authToken);
    this.stopInterval();
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.TOKEN_EXP);
    // this.events.publish('logout:successful');
  }

  login(loginData) {
    return this.http.post(this.env.url + '/users/login', loginData)
      .map(res => res.json());
  }

  register(user) {
    return this.http.post(this.env.url + '/users/register', user)
      .map(res => res.json());
  }

  verifyEmail(authToken) {
    return this.http.get(this.env.url + '/users/verify?auth=' + authToken)
      .map(res => res.json());
  }

  forgotPassword(email) {
    return this.http.get(this.env.url + '/users/forgot?email=' + email)
      .map(res => res.json());
  }

  resetPassword(newPassword) {
    return this.http.post(this.env.url + '/users/reset', newPassword)
      .map(res => res.json());
  }

  logout() {
    return this.http.get(this.env.url + '/users/logout', this.getHeaders())
      .map(res => res.json());
  }

  isAuthenticated() {
    return this.authenticated;
  }

  setTokenExp(exp) {
    if (exp == '') {
      this.tokenExp = undefined;
    } else {
      this.tokenExp = exp;
    }
    console.log('Set token: ' + this.tokenExp);
  }

  getUser() {
    return this.user;
  }

  updateUser(updatedData) {
    updatedData.token = this.authToken;
    this.storage.remove(this.TOKEN_KEY);
    this.storeUserCredentials(updatedData, undefined);
  }

  setHeaders(token) {
    this.headers = new Headers();
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('access-token', token);
  }

  getHeaders() {
    return new RequestOptions({ headers: this.headers });
  }
}
