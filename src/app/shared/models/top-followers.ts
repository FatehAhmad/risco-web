import { UserModel } from "./userModel";

export class TopFollowersModel{    
    Id: number;
    FirstUser_Id: 1099;
    FirstUser:UserModel;        
    SecondUser_Id: number;
    SecondUser: UserModel;
    CreatedDate: string;
    IsDeleted: boolean;
    IsFollowing: boolean;      
}