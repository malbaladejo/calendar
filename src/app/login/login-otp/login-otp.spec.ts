import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginOTP } from './login-otp';

describe('LoginOTP', () => {
  let component: LoginOTP;
  let fixture: ComponentFixture<LoginOTP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginOTP],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginOTP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
