import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTagComponent } from './custom-tag.component';

describe('CustomTagComponent', () => {
  let component: CustomTagComponent;
  let fixture: ComponentFixture<CustomTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTagComponent]
    });
    fixture = TestBed.createComponent(CustomTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
