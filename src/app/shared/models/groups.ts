import { UserModel } from "./userModel";

export class GroupsModel{        
    Id: number;
    Name: string;
    Description:string;
    ImageUrl: string;
    CoverImageUrl: string;
    User_Id: number;
    User: UserModel;
    Status:number;
    CreatedDate: Date;
    IsDeleted: boolean;
    IsAdmin:boolean;
    IsUserFollow:boolean; 
    PostsCount: number;
    MembersCount: number;
    Group_Id:number;
    AdminViewBlocked:boolean;
}