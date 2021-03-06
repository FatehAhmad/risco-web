export class Promotions{
    name:string;
    id:number;
    is_active?:boolean;
    is_deleted?:boolean=false;
    percentage?:number;
    from_date?:Date;
    to_date?:Date;
} 