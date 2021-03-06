import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerificationComponent } from './verification/verification.component';
import { TopicsComponent } from './topics/topics.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'account-setting', component: AccountSettingComponent},
  { path: 'verification', component: VerificationComponent},
  { path: 'forgetpassword', component: ForgetpasswordComponent},
  { path: 'topics', component: TopicsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
