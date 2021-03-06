import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacysettingComponent } from './privacysetting.component';

describe('PrivacysettingComponent', () => {
  let component: PrivacysettingComponent;
  let fixture: ComponentFixture<PrivacysettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacysettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacysettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
