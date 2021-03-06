import { animate } from "@angular/animations";
import { Injectable, Input } from "@angular/core";
import { Gift } from "../models/gift";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs";
import { webService } from "../global.config";
import { LoggedInUser } from "../classes/loggedInUser";
import { Router } from "@angular/router";
import "rxjs/Rx";
import { SignUpModel } from "../models/signup";
import { UserModel } from "../models/userModel";
import { AccountSettingsModel } from "../models/account-settings";
import {
  ChangePasswordModel,
  ResetPasswordModel,
} from "../models/change-password";
import { PrivacySettingsModel } from "../models/privacy-settings";
import { NotificationSettingsModel } from "../models/notification-settings";
import { RegisterPushNotification } from "../models/register-push-notification";
import { ResponseModel } from "../models/response-model";
import { PostService } from "./post.service";

@Injectable()
export class UserService {
  static ImageUrl;
  hasNotifications = false;
  objUSerModel: UserModel = new UserModel();

  static pendingRequestAllUsers = 0;
  static showAllUsersLoader: boolean;

  constructor(
    private objHttp: Http,
    private objRouter: Router,
    private http: Http
  ) {}

  checkUserAuth(Email: string, Password: string) {
    let Body = {
      email: Email,
      PhoneNo: Email,
      password: Password,
      Platform: 1,
      UDID: 0,
      IsPlayStore: false,
      IsProduction: false,
      User_Id: 0,
    };
    PostService.incPendingRequestCount();
    return this.objHttp
      .post(webService("/User/Login"), Body)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      });
  }

  register(objSignUpModel: SignUpModel) {
    PostService.incPendingRequestCount();
    return this.objHttp
      .post(webService("/User/Register"), objSignUpModel)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      });
  }

  updateProfile(objUserModel: UserModel) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .post(webService("/User/SetAccountSettings"), objUserModel, opts)
      .map((res: Response) => res.json());
  }

  updateProfileImage(Picture) {
    let formData: FormData = new FormData();
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    if (Picture) formData.append("profile_picture", Picture);

    return this.objHttp
      .post(webService("/User/UpdateUserProfileImage"), formData, opts)
      .map((res: Response) => res.json());
  }

  reportUser(User_Id: number, ReportUserStatus: string) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .get(
        webService(
          "/User/ReportUser?User_Id=" +
            User_Id +
            "&ReportUserStatus=" +
            ReportUserStatus
        ),
        opts
      )
      .map((res: Response) => {
        return res.json();
      });
  }

  getNotifications(UserId: number, SignInType: number, PageSize: number, PageNo: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .get(
        webService(
          "/User/GetNotifications?UserId=" + UserId + "&SignInType=" + SignInType + "&Page=" + PageSize + "&Items=" + PageNo
        ),
        opts
      )
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      });
  }

  markAsRead(NotificationId: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .get(
        webService(
          "/User/MarkNotificationAsRead?NotificationId=" + NotificationId
        ),
        opts
      )
      .map((res: Response) => {
        return res.json();
      });
  }

  updateCoverImage(Picture) {
    let formData: FormData = new FormData();
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    if (Picture) formData.append("CoverPictureUrl", Picture);

    return this.objHttp
      .post(webService("/User/UploadCoverImage"), formData, opts)
      .map((res: Response) => res.json());
  }

  forgetPassword(Email: string) {
    PostService.incPendingRequestCount();
    return this.objHttp
      .get(webService("/User/ResetPasswordThroughEmail?Email=" + Email))
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      });
  }

  changePassword(objChangePassword: ChangePasswordModel) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    PostService.incPendingRequestCount();
    return this.objHttp
      .post(webService("/User/ChangePassword"), objChangePassword, opts)
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      });
  }

  resetPassword(objResetPassword: ResetPasswordModel) {
    let headers = new Headers();
    //headers.append("Authorization", "bearer " + LoggedInUser.getLoggedInUser().Token.access_token);
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .post(webService("/User/ChangeForgotPassword"), objResetPassword, opts)
      .map((res: Response) => res.json());
  }

  registerPushNotification(objPushNotification: RegisterPushNotification) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .post(
        webService("/User/RegisterPushNotification"),
        objPushNotification,
        opts
      )
      .map((res: Response) => res.json());
  }

  getUserData() {
    let id: number;
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    id = LoggedInUser.getLoggedInUser().Id;

    return this.objHttp
      .get(webService("/User/GetUser?UserId=" + id), opts)
      .map((res: Response) => {
        var a = res.json();
        UserService.ImageUrl = a.Result.ProfilePictureUrl; //set
        return a;
      });
  }

  getAllUsers(PageSize: number, PageNo: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(
        webService(
          "/User/GetAllUsers?PageSize=" + PageSize + "&PageNo=" + PageNo
        ),
        opts
      )
      .map((res: Response) => res.json());
  }

  getCountries() {
    let apiUrl = "./assets/country.json";
    return this.http.get(apiUrl).map((response: Response) => {
      const data = response.json();
      return data;
    });
  }

  privacysetting(objPrivacySettingsModel: PrivacySettingsModel) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .post(
        webService("/User/SetPrivacySettings"),
        objPrivacySettingsModel,
        opts
      )
      .map((res: Response) => res.json());
  }

  notificationsettings(
    objNotificationSettingsModel: NotificationSettingsModel
  ) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .post(
        webService("/User/SetNotificationSettings"),
        objNotificationSettingsModel,
        opts
      )
      .map((res: Response) => res.json());
  }


  getNotificationTypes(screenId: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(webService("/User/GetNotificationTypes?ScreenId=" + screenId), opts)
      .map((res: Response) => res.json());
  }


  updateUserNotificationSetting(notificationTypeId, status) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(webService("/User/UpdateUserNotificationSetting?NotificationTypeId=" + notificationTypeId + "&Status=" + status), opts)
      .map((res: Response) => res.json());
  }

  searchGroup(SearchText: string) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    SearchText = encodeURIComponent(SearchText);
    return this.objHttp
      .get(webService("/Search/Search?SearchText=" + SearchText), opts)
      .map((res: Response) => res.json());
  }

  getUserById(UserId: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(webService("/User/GetUser?UserId=" + UserId), opts)
      .map((res: Response) => res.json());
  }

  updateUserInterests(selectedInterests: string, selectedLanguages: string) {
    let headers = new Headers();
    let Body = { interests: selectedInterests }

    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .get(webService("/User/UpdateUserInterest?interests=" + selectedInterests + "&" + selectedLanguages), opts)
      .map((res: Response) => res.json());
  }

  markAsVerfied(ID: number, Email: string) {
    let Body = { ID: ID, Email: Email };
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .post(webService("/User/MarkVerified"), Body, opts)
      .map((res: Response) => res.json());
  }

  verifySmsCode(data) {
    PostService.incPendingRequestCount();
    return this.objHttp
      .get(
        webService(
          "/User/VerificationOfCode?Email=" +
            data["Email"] +
            "&VerificationCode=" +
            data["Code"] +
            "&Authorization=" +
            data["Authorization"]
        )
      )
      .map((res: Response) => {
        PostService.decPendingRequestCount();
        return res.json();
      });
  }

  resendCodeApi(data) {
    return this.objHttp
      .get(webService("/User/ResendCode?Email=" + data["Email"]))
      .map((res: Response) => res.json());
  }

  getMediaUserById(UserId: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(webService("/User/GetMediaByUserId?UserId=" + UserId), opts)
      .map((res: Response) => res.json());
  }

  blockUser(User_Id: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(webService("/User/BlockUser?User_Id=" + User_Id), opts)
      .map((res: Response) => res.json());
  }

  unBlockUser(User_Id: number) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.objHttp
      .get(webService("/User/UnBlockUser?User_Id=" + User_Id), opts)
      .map((res: Response) => res.json());
  }

  deactivateAccount(): Observable<ResponseModel> {
    let id: number;
    let headers = new Headers();
    headers.append(
      "Authorization",
      "bearer " + LoggedInUser.getLoggedInUser().Token.access_token
    );
    let opts = new RequestOptions();
    opts.headers = headers;

    return this.objHttp
      .get(webService("/User/DeactivateAccount"), opts)
      .map((res) => {
        return res.json();
      })
      .catch((error, caught) => {
        console.error(error);
        return caught;
      });
  }

  public static incPendingGetAllUsersRequestCount() {
    UserService.pendingRequestAllUsers++;
    UserService.showAllUsersLoader = UserService.pendingRequestAllUsers > 0;
  }

  public static decPendingGetAllUsersRequestCount(toZero = false) {
    if (UserService.pendingRequestAllUsers > 0)
      UserService.pendingRequestAllUsers--;
    UserService.showAllUsersLoader = UserService.pendingRequestAllUsers > 0;

    if (toZero && UserService.pendingRequestAllUsers > 0) {
      UserService.decPendingGetAllUsersRequestCount(toZero);
    }
  }
}
