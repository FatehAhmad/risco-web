import { Pipe, PipeTransform } from '@angular/core';
declare var moment;
@Pipe({
    name: 'remainingtime',
    pure:false
})


export class RemainingTime implements PipeTransform {

    transform(time) {
        if(time){
            
            //  current system date
            var date_future = time;
            let date_now : any = new Date();
    
            var seconds = Math.floor((date_future - ( date_now ))/1000);
            var minutes = Math.floor(seconds/60);
            var hours = Math.floor(minutes/60);
            var days = Math.floor(hours/24);
            // var months = Math.floor()
            var hours = hours-(days*24);
            var minutes = minutes-(days*24*60)-(hours*60);
            var seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
            
            
            if(days && !hours && minutes){
                if(days == 1){
                    return "in "+days+" day and "+minutes+" minutes";
                }else return "in "+days+" days and "+minutes+" minutes";
            }else
            if(days && hours ){
                return "in "+days+" days and "+hours+" hours";
            }else 
            if(!days && hours && minutes){
                return "in "+hours+" hours and "+minutes+" minutes";
            }else
            if(!days && !hours && minutes){
                return "in "+minutes+" minutes";
            }else
            if(!days && !hours && !minutes && seconds){
                return "in few seconds"
            }
        }return ''
    }
}