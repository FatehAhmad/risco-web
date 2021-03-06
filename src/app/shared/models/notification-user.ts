export class UserNotifications{
    Id: number;
    Title: string;
    Description: string;
    EntityType: number;
    EntityId: number;
    SendingUser_Id: number;
    ReceivingUser_Id: number;
    Status: number;
    CreatedDate: Date;
    AdminNotification_Id: number;
    AdminNotification: UserNotifications;
}