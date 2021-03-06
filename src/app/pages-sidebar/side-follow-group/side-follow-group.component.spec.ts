import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideFollowGroupComponent } from './side-follow-group.component';

describe('SideFollowGroupComponent', () => {
  let component: SideFollowGroupComponent;
  let fixture: ComponentFixture<SideFollowGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideFollowGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideFollowGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
