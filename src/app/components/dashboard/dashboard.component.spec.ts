/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HandleApiService } from '../../service/handle-api/handle-api.service';
import { of, throwError } from 'rxjs';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonService } from '../../service/tracker-service/common.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiServiceMock: any;
  let commonServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    commonServiceMock = {
      getRole: jest.fn(),
      setCategoryDetails: jest.fn()
    };
    apiServiceMock = {
      getCategory: jest.fn(),
      deleteCategory:jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [MaterialModule, HttpClientModule, MatSnackBarModule],
      providers: [
        {
          provide: MaterialModule, useValue: {}
        },
        {
          provide: HttpClientModule, useValue: {}
        },
        {
          provide: HandleApiService, useValue: apiServiceMock
        },
        {
          provide: CommonService, useValue: commonServiceMock
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verifyRole to set role', () => {
    const role = "admin";
    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(role);
    component['verifyRole']();
    expect(component.role).toEqual('admin');
  }
  )
  it('should getCategory api call method return success to set categoryList', () => {
    const expectGetRoleResp = {
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    };

    const expectRes = [{
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    }];

    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(of(expectGetRoleResp));
    jest.spyOn(apiServiceMock, 'getCategory').mockReturnValue(of(expectRes));
    fixture.detectChanges();
    expect(component.categoryList).toEqual(expectRes);
  });

  it('should getCategory api fails through error response', () => {
    const expectGetRoleResp = {
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    };

    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    })

    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(of(expectGetRoleResp));
    jest.spyOn(apiServiceMock, 'getCategory').mockReturnValue(throwError(() => errorResponse));
    component.getCategory();
    expect(component.categoryList).toEqual([]);
  });

  it('should show view task page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const categorySelected = {
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    };
    component.viewTask(categorySelected);

    expect(navigateSpy).toHaveBeenCalledWith(["/tasktracker/view-task"])
  });

});
