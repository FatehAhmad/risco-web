import { Pipe, PipeTransform } from '@angular/core';
import { UserNotifications } from '../../../../app/Shared/models/notification-user';
import { MessagingService } from '../../../../app/Shared/services/push-notifications';

@Pipe({
    name: 'isNotificationUnread',
    pure: false
})


export class IsNotificationUnread implements PipeTransform {

    transform(list: UserNotifications[]): boolean {
        if(list && list.length > 0){
            var unread = list.find(x => x.Status === 0);
            if(unread || MessagingService.notificationUnread){
                return true;
            }
        }
        return false;
    }
}