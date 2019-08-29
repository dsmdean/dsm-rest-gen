import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  env: any;

  constructor(public http: HttpClient) {
    this.env = { url: '' };
    // this.env.url = 'https://supprtr-single.herokuapp.com/api';
    this.env.url = 'http://localhost:9001';
  }

  getEnv() {
    return this.env;
  }
}
