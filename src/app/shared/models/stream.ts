import { User } from './user'
export class Stream {
    id:number;
    user_id?:number;
    uuid?:string;
    name?:string;
    stream_ip?:string;
    stream_port?:number;
    stream_app?:string;
    status?:number;
    privacy_setting?:number;
    quality?:number;
    is_public?:boolean;
    allow_comments?:boolean;
    allow_tag_requests?:boolean;
    available_later?:boolean;
    lng?:string;
    lat?:string;
    total_likes?:number;
    total_dislikes?:number;
    total_shares?:number;
    total_viewers?:number;
    created_at?:string;
    updated_at?:string;
    status_text?:string;
    quality_text?:string;
    user_details?:User;
}
