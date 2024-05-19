import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearNavigationComponent } from './year-navigation.component';

describe('YearNavigationComponent', () => {
  let component: YearNavigationComponent;
  let fixture: ComponentFixture<YearNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearNavigationComponent]
    });
    fixture = TestBed.createComponent(YearNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
