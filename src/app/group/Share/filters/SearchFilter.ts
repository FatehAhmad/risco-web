import { Pipe, PipeTransform } from '@angular/core';
import { FollowingModel } from '../../../../app/shared/models/followings';

@Pipe({
    name: 'searchFilter',
    pure:false
   
})


export class SearchFilter2 implements PipeTransform {

    transform(list: FollowingModel[], searchQuery: string = ''): FollowingModel[] {
        if(list && list.length > 0 && searchQuery){
            return list.filter(x => x.FirstUser.FullName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1);
        }
        return list;
    }
}