import { ParentComments } from "./parent-comments";
import { UserModel } from "./userModel";

export class ChildCommentsModel{
    ChildComment:ParentComments[];
    CreatedDate:string;
    Id:number;
    IsDeleted:boolean;
    IsLiked:boolean;
    ParentComment_Id:number;
    Post_Id:number;
    Text:string;
    User:UserModel;
    User_Id:number;
}