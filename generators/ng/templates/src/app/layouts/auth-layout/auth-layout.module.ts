import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { VerifyComponent } from '../../pages/verify/verify.component';
import { ForgotComponent } from '../../pages/forgot/forgot.component';
import { ResetComponent } from '../../pages/reset/reset.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    NgbModule,
    PasswordStrengthMeterModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ForgotComponent,
    ResetComponent
  ]
})
export class AuthLayoutModule { }
