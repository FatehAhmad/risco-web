import { UserModel } from "./userModel";
import { GroupDataModel } from "./group-data";

export class JoinModel{  
    Id: number;
    User_Id: number;
    User: UserModel;
    Group_Id: number;
    Group: GroupDataModel;
    Status: number;
    CreatedDate: Date;
    IsDeleted: boolean;
    IsUserFollow: boolean;
}