import { UserModel } from '../models/userModel';
import { ThrowStmt } from '@angular/compiler';
import { UserService } from '../services/user.service';

export class LoggedInUser{
   
    static getLoggedInUser():UserModel{
        const objUser:UserModel = JSON.parse(localStorage.getItem('loggedInUser'));
        if(objUser==null||objUser==undefined){
            return null;
        }
        return objUser;
    }

    static addLoggedInUser(user):void{
        localStorage.setItem("loggedInUser",JSON.stringify(user));
    }
   static logoutUser():void{
        localStorage.removeItem("loggedInUser");     

    }
}