import { UserModel } from "./userModel";

export class FollowingModel{
      Id: number;
      FirstUser_Id: number;;
      FirstUser: UserModel;
      SecondUser_Id: number;
      SecondUser:UserModel;    
      CreatedDate: string;
      IsDeleted: false;  
      IsUserFollow:boolean=true;  
      IsFollowing:boolean=false;   
}