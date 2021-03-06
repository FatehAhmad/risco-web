import { UserModel } from "./userModel";

export class GeneralGroupsModel{
    Id: number;
    Name: string;
    Description: string;
    ImageUrl: string;
    Interest_Id: number;
    Interest: string;
    User_Id: number;
    Status:number;
    User: UserModel;
    CreatedDate: Date;
    IsDeleted: boolean;
    PostsCount: number;
    MembersCount: number
}