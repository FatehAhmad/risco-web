import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsettingComponent } from './notificationsetting.component';

describe('NotificationsettingComponent', () => {
  let component: NotificationsettingComponent;
  let fixture: ComponentFixture<NotificationsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
