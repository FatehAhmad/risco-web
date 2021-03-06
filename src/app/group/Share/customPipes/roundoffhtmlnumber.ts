import {
    Pipe ,
    PipeTransform
} from '@angular/core'

@Pipe({
    name : 'roundoffhtmlnumber'
})

export class RoundOffHtmlNumber{
    transform(value : any ){
        let _value = Math.floor(value); 
        if(_value > 0){
            return _value;
        }else return 0;
    }
}