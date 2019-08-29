import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { EnvService } from './env';
import { AuthenticationService } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  env: { url };

  constructor(public http: Http, private EnvService: EnvService, public auth: AuthenticationService) {
    this.env = EnvService.getEnv();
  }

  updateUser(userData) {
    return this.http.put(this.env.url + '/users/' + userData._id, userData, this.auth.getHeaders())
      .map(res => res.json());
  }

  getUserById(userId) {
    return this.http.get(this.env.url + '/users/' + userId, this.auth.getHeaders())
      .map(res => res.json());
  }

  getUser(email) {
    return this.http.get(this.env.url + '/users/findByEmail/' + email)
      .map(res => res.json());
  }

  resetPassword(userId, data) {
    return this.http.put(this.env.url + '/users/' + userId + '/reset', data, this.auth.getHeaders())
      .map(res => res.json());
  }

  deactivate(userId) {
    return this.http.delete(this.env.url + '/users/' + userId, this.auth.getHeaders())
      .map(res => res.json());
  }

  getAllUsers() {
    return this.http.get(this.env.url + '/users', this.auth.getHeaders())
      .map(res => res.json());
  }
}
