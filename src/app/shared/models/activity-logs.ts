import { UserModel } from "./userModel";

export class ActivityLogModel{
    Id: number;
    Text: string;
    FirstUser_Id: number;
    FirstUser: UserModel;
    SecondUser_Id: number;
    SecondUser: UserModel;
    EntityType: number;
    EntityId: number;
    CreatedDate: Date;
    IsDeleted: boolean;
}