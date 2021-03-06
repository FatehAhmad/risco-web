import { GroupsModel } from "./groups";
import { UserModel } from "./userModel";
import { GeneralGroupsModel } from "./general-groups";

export class GeneralSearchModel{
    Groups:GroupsModel[];
    Users:UserModel[];
    MyGroups:GeneralGroupsModel[];     
    SuggestedGroupCount: number;
    SuggestedGroups:GeneralGroupsModel[];
}