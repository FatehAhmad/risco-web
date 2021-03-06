import { TokenModel } from "./token";
import { InterestsModel } from "./interests";
import { BasketSettings } from "./basket-settings";
import { LanguageModel } from "./language";

export class UserModel {


    public checkNull(Value){
        if(Value == "undefined" || Value == undefined || Value == null || Value == "null"){
            return "";
        }
        return Value;
    }
    Id: number;
    BasketSettings:BasketSettings;
    FullName: string;
    ProfilePictureUrl: string;
    CoverPictureUrl:string;
    Email: string;
    Phone: number;
    UserName: string;
    IsFollowing:boolean;
    IsFollower:boolean;
    Status: string;
    Gender: string;
    Language: string;
    CountryCode: string;
    AboutMe: string;
    Token?:TokenModel;
    // Interests: InterestsModel;
    IsLoginVerification: boolean;
    IsPasswordResetVerification:boolean;
    SignInType: boolean;
    IsNotificationsOn: boolean;
    IsVideoAutoPlay: boolean;
    IsPeopleIDontFollow: boolean;
    IsPeopleWhoDontFollowMe: boolean;
    IsPeopleWithNewAccount: boolean;
    IsPeopleWithDefaultProfilePhoto: boolean;
    IsPeopleWithUnverifiedEmail: boolean;
    IsPeopleWithUnverifiedPhone: boolean;
    IsPostLocation: boolean;
    IsAllowAnyOneToTagYouInPosts: boolean;
    IsAllowOnlyPeopleYouFollowToTagYouInPosts: boolean;
    IsAllowPeopleWhoFollowMeToTagYouInPosts: boolean;
    IsDontAllowAnyoneToTagYouInPosts: boolean;
    EmailConfirmed: boolean;
    PhoneConfirmed: boolean;
    IsAllowAnyOneToSendDirectMessage: boolean;
    MessagePrivacy:number;
    IsAllowOnlyPeopleYouFollowToSendDirectMessage: boolean;
    IsAllowPeopleWhoFollowMeToSendDirectMessage: boolean;
    IsDontAllowAnyOneToSendDirectMessage: boolean;
    IsDeleted: boolean
    PostCount: number;
    FollowingCount: number = 0;
    FollowersCount: number=0;
    IncidentCount: number = 0;
    LikesCount: number = 0;
    RepliesCount: number = 0;
    MediaCount: number;
    Interests: string = "";
    IsBlocked:boolean;
    IsMessagingAllowed:boolean;
    Languages: LanguageModel[];
    AllLanguages: LanguageModel[];
    // PaymentCards: [];
    // Favourites: [];
    // UserRatings: [];
    // DeliveryManRatings: [];
    // Notifications: [];
    // Orders: [];
    // AppRatings: [];
    // ProductRatings: [];
    // UserAddresses: [];
    // UserDevices: [];
    // StoreRatings: [];
    // UserSubscriptions: [];
    // Feedback: [];
    // VerifyNumberCodes: [];

    // Token: {
    //   access_token: HgUeK2j6BPI-D4LqcUaCum6sASbyOIoqvo1kO9TysESraFLMcilziHocHvTc41Fbt7Jr6IWVsDtG_42Ophk_znWcB2cXUU9r1Ox6ul_7z8vMh8qvy_M6D4E_hYsC51tBseJZ-3yITuISCRF3Y0Jg2WtZrht-_VcpVwKSjkaROeJIPx-tB-_68Zm2Eey5Cc4IBYSBqEMjbBW936sfbUK8-sxqp5RojyfIjZOW0EB9VSa88_yFh30--ySaqwWsaKm-tIyXPHIiaJPfBibfQk7c_NMsi9KcKba56eDX0N5_G0kNtFLmIHNbAfw2qlSCqEYlw_saQ4rUzCPZMkT8TLlfAQ;
    //   token_type: bearer;
    //   expires_in: 2591999;
    //   refresh_token: a68d134f-ac72-41d6-ba6e-47649f6b3365
    // };
}
