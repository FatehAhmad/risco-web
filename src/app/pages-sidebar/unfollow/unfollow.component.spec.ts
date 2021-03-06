import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnFollowComponent } from './unfollow.component';

describe('UnfollowComponent', () => {
  let component: UnFollowComponent;
  let fixture: ComponentFixture<UnFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
