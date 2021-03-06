import {
    Pipe ,
    PipeTransform
} from '@angular/core'
import {formatDate } from '@angular/common';

@Pipe({
    name : 'dayscount'
})

export class DaysCount{

    transform(value){
        return this.datediff(this.parseDate(value), this.parseDate(this.getCurrentDate()));
    }

    private parseDate(str) {
    
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

    private getCurrentDate(){
        var today = new Date();
        var jstoday : any;
        
        return jstoday = formatDate(today, 'MM/dd/yyyy', 'en-US', '+0530');
    }

    private datediff(first, second) {
                 
        return Math.round((second-first)/(1000*60*60*24));
    }

}
