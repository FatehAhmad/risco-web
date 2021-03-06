import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesSidebarComponent } from './pages-sidebar.component';

describe('PagesSidebarComponent', () => {
  let component: PagesSidebarComponent;
  let fixture: ComponentFixture<PagesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
