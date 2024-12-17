/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HandleApiService } from '../../service/handle-api/handle-api.service';
import { CommonService } from '../../service/tracker-service/common.service';
import { AuthenticationService } from '../../service/auth/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiServiceMock: any;
  let commonServiceMock: any;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    commonServiceMock = {
      getRole: jest.fn(),
      setCategoryDetails: jest.fn(),
      setUserInfo: jest.fn()
    };
    apiServiceMock = {
      getCategory: jest.fn(),
      verifyUser: jest.fn()
    };
    authServiceMock = {
      login: jest.fn()
    }


    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,MaterialModule,NoopAnimationsModule
      ],
      providers: [
        {
          provide: MaterialModule, useValue: {}
        },
        {
          provide: HttpClientModule, useValue: {}
        },
        {
          provide: ReactiveFormsModule, useValue: {}
        },
        {
          provide: HandleApiService, useValue: apiServiceMock
        },
        {
          provide: CommonService, useValue: commonServiceMock
        },
        {
          provide: AuthenticationService, useValue: authServiceMock
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when email and password is invalid,then login button should be disabled', () => {
    const loginButton = fixture.debugElement.query(By.css("form"));
    component.loginForm.controls['emailId'].setValue('');
    component.loginForm.controls['password'].setValue('');
    fixture.detectChanges();
    expect(loginButton.nativeElement.querySelector('button').disabled).toBeTruthy();
  });

  it('when email and password is valid,then login button should be enabled', () => {
    const loginButton = fixture.debugElement.query(By.css("form"));
    component.loginForm.controls['emailId'].setValue('admin@gmail.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();
    expect(loginButton.nativeElement.querySelector('button').disabled).toBeFalsy();
  })

  it('should login success redirect to dashboard page', () => {
    const expectResp = [{
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }];
    jest.spyOn(authServiceMock, 'login').mockReturnValue(of('Login success'));
    jest.spyOn(apiServiceMock, 'verifyUser').mockReturnValue(of(expectResp));
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(["/tasktracker/dashboard"])
  });

  it('should login fail not redirect to dashboard page ', () => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: "INVALID_LOGIN_CREDENTIALS",

    })
   

    jest.spyOn(authServiceMock, 'login').mockReturnValue(throwError(()=>errorResponse));
    // jest.spyOn(apiServiceMock, 'verifyUser').mockReturnValue(of(expectResp));
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onSubmit();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
