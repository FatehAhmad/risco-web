import { PostModel } from "./post";
import { UserModel } from "./userModel";

export class MediaModelCollection{
    Id: number;
    Type: number;
    Url: string;
    Post: PostModel;
    User_Id: number;
    User: UserModel;
    IsDeleted: boolean;
    CreatedDate: Date;
}