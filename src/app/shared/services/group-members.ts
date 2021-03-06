import { UserModel } from "../models/userModel";

export class GroupMembersModel{      
    Id: number;
    User_Id: number;
    User: UserModel;
    Group_Id: number;
    Group: null;
    Status: number;
    CreatedDate: Date;
    IsDeleted: boolean;
    IsUserFollow: boolean; 
    IsBlockedForOtherUser: boolean;
}