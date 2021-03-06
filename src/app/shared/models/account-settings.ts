import { InterestsModel } from "./interests";

export class AccountSettingsModel{   
   Id:number;
   FullName:string;
   Email:string;
   Language:string;  
   AboutMe:string; 
   CountryCode:string;
   InterestsArray:InterestsModel[];
   Interests: string = "";
   IsVideoAutoPlay:boolean;
   IsLoginVerification:boolean;
}