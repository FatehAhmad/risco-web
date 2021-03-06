import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { PropertyFilterModel } from "../models/PropertyFilterModel";

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<any>(undefined);
  currentMessage = this.messageSource.asObservable();

  private leaveGroupSource = new BehaviorSubject<any>(undefined);
  leaveGroupMessage = this.leaveGroupSource.asObservable();

  private membersSource = new BehaviorSubject<any>(undefined);
  currentMember = this.membersSource.asObservable();

  private notify = new BehaviorSubject<any>(undefined);
  notifyObservable$ = this.notify.asObservable();

  constructor() { }

  public notifyOther(data: any) {
    if (data) {

      this.notify.next(data);
    }
  }


  changeMessage(filterModel: any) {
    this.messageSource.next(filterModel);
  }

  leaveGroup(filterModel: any) {
    this.leaveGroupSource.next(filterModel);
  }

  changeMember(data: any) {
    this.membersSource.next(data);
  }


}
