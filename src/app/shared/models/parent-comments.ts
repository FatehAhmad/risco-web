import { UserModel } from "./userModel";
import { MediaModelCollection } from "./media-model";

export class ParentComments{
    Id: number;
    Text: string;
    Post_Id: number;
    ParentComment_Id: number;
    User_Id: number;
    User:UserModel;
    CreatedDate: Date;
    IsDeleted: boolean;  
    IsLiked:boolean;
    ChildComments:ParentComments[];
    Medias: MediaModelCollection[];
    // Likes: [];   
}