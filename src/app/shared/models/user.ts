export class User {

    constructor(){
        this.mobile_no = this.checkNull(this.mobile_no);
        this.bank_account = this.checkNull(this.bank_account);
        this.remarks = this.checkNull(this.remarks);
    }

    public checkNull(Value){
        if(Value == "undefined" || Value == undefined || Value == null || Value == "null"){
            return "";
        }
        return Value;
    }
    
    Id: number;
    cm_id?:number;
    cs_id?:number;
    role_id?:number;
    managers?:string="";
    cm?:string="";
    cs?:string="";
    satellites?:string="";
    full_name: string;
    username?: string;
    total_earning_by_month?:any;
    total_earning_by_day?:any;
    total_earning_by_weak?:any;
    email: string;
    password?:string;
    user_complete_id?:string="";
    token?:string;
    status?: number;
    status_text?: string;
    gender?: string;
    mobile_no?: string;
    is_artist?: number;
    is_deleted?:boolean=false;
    is_picture?: number;
    user_id_by_admin:string;
    // privacy_setting?: number;
    // notification_status?: number;
    // device_type?: string;
    // device_token?: string;
    // verification_code?: string;
    // is_verified?: number;
    // status_text_value?: string;
    // role_name?: string\
   
    profile_picture_url?:string;   
    created_at?: string;
    cs_cm?: string;
    remarks?: string = "";
    bank_account?:string;
    address?:string="";
    city?:string="";
    country?: string = "";
    user_current_tornados?:number;
    user_total_tornados?:number;
    artist_current_tornados?:number;
    artist_total_tornados?:number;
    chips?:number;
    gift_send?:number;
    total_followers?:number;
    total_followings?:number;
    total_friends?:number;
    total_streams?:number;
    user_energy?:number;
    user_level?:number;
    witkey_dollar?:number;
}
