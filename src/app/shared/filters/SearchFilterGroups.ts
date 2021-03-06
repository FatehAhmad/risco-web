import { Pipe, PipeTransform } from '@angular/core';
import { FollowingModel } from '../models/followings';
import { GroupsModel } from '../models/groups';

@Pipe({
    name: 'searchFilterGroup',
    pure:false
   
})


export class SearchFilterGroups implements PipeTransform {

    transform(list: GroupsModel[], searchQuery: string = ''): GroupsModel[] {
        if(list && list.length > 0 && searchQuery){
            return list.filter(x => x.Name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1);
        }
        return list;
    }
}