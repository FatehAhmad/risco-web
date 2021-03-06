import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupShowingComponent } from './group-showing.component';

describe('GroupShowingComponent', () => {
  let component: GroupShowingComponent;
  let fixture: ComponentFixture<GroupShowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupShowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupShowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
