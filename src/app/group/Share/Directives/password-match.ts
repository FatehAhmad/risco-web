import { AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';
import { SignUpModel } from '../../../../app/shared/models/signup';
 
export function passwordMatch
(control: AbstractControl):{[key: string]: boolean}  {

    //Grab pwd and confirmPwd using control.get
      //const pwd=this.objSignUpModel.password;
    const pwd = control.value;
    const confirmPwd= (<HTMLInputElement>document.getElementById("ps")).value;
    //$("#ps").value;
      //const confirmPwd=this.objSignUpModel.ConfirmPassword;
   // const confirmPwd = control.get('confirm_password');
       
    // If FormControl objects don't exist, return null
    if (!pwd || !confirmPwd) return null;
     
    //If they are indeed equal, return null
     if (pwd === confirmPwd) {
      return null;
    }
   //Else return false
   return {
      mismatch: true 
    };

}
 
   
//PasswordMatchDirective  
@Directive({
    selector: '[passwordMatch]', //1
    providers: [ //2
      {
        provide: NG_VALIDATORS, 
        useValue: passwordMatch, 
        multi: true
      }
    ]
  })
 
export class PasswordMatchDirective {
}