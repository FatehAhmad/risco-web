import { NotificationType } from "./notification-type";

export class NotificationSettingsModel{
    GroupsNotification: boolean = false;
    PostsNotification: boolean = false;


     Id: number;
     Title: string;
     Description: string;
     CreatedDate: string;
     IsDeleted: boolean;

     IsCategory: boolean;
     NotificationTypeList: NotificationType[];


}
