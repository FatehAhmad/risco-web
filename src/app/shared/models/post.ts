import { UserModel } from "./userModel";
import { MediaModel } from "./media";
import { PollTypeEnum } from "../enum/poll-type-enum";

export class PostModel {
    constructor(){
        this.User = new UserModel();
    }
    Id: number;
    User_Id: number;
    Text: string = "";
    Texts: string[] = [""];
    ImageUrlList: string[] = [];          //this array will store media urls for this post returned from the server
    VideoUrlList: string[] = [];          //this array will store media urls for this post returned from the server
    Visibility: number = 1;
    RiskLevel: number = 1;
    Location: string = "";
    Latitude: number;
    Longitude: number;
    PostType: number;
    ImageUrls: string = "";
    VideoUrls: string = "";
    User: UserModel;
    CreatedDate: Date;
    IsDeleted: boolean;
    UserGroup_Id: number;
    UserGroup: string;
    Medias: MediaModel[] = [];
    IsLiked: boolean;
    LikesCount: number = 0;
    CommentsCount: number = 0;
    ShareCount: number = 0;
    IsUserFollow: boolean;
    IsNotificationOn: boolean;
    Group_Id: number;
    /*-----------------------FOR POLL------------------------*/
    IsPoll: boolean = false;
    Interests: string;
    PollType: PollTypeEnum = PollTypeEnum.None;
    ExpireAfterHours: number = 0;
    PollOptions: PollOption[] = [];
    IsExpired: boolean;
    PollExpiryTime: Date;
    /*--------------------FOR REPOST---------------------------*/
    SharedParent: PostModel;
    SharePost_Id: number;

    ExtendedPostList: PostModel[] = [];
    ExtendedPost: PostModel;


    /*--------------------FOR ---------------------------*/
    IsToggled:boolean=false;
}

export class PollOption {
    Title: string = "";
    MediaUrl: string = "";
    Post_Id: number;
    Id: number;
    Votes: number = 0;
    Percentage: number = 0;
    IsDeleted: boolean = false;
    IsVoted: boolean = false;
    Post?: PostModel;
}
