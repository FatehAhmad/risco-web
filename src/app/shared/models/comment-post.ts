import { MediaModel } from "./media";
import { ParentComments } from "./parent-comments";
import { UserModel } from "./userModel";

export class CommentPostModel{
    
    Id: number; 
    Text: string;
    Visibility: number;
    RiskLevel: number; 
    FullName:string;
    Location: string="";
    ImageUrls: string=""; 
    CreatedDate: Date;
    User:UserModel;
    IsDeleted: boolean;
    UserGroup_Id: number;
    UserGroup: string;
    Medias: MediaModel[];  
    IsLiked: boolean;
    LikesCount: number;
    CommentsCount: number;
    ShareCount: number;
    IsUserFollow: boolean;
    IsToggled:boolean=false;
    Comments:ParentComments[] = [];
    
}