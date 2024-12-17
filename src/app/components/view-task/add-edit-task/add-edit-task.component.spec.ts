/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTaskComponent } from './add-edit-task.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../modules/material/material.module';
import { HandleApiService } from '../../../service/handle-api/handle-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

describe('AddEditTaskComponent', () => {
  let component: AddEditTaskComponent;
  let fixture: ComponentFixture<AddEditTaskComponent>;
  let apiServiceMock: any;
  let commonServiceMock: any;

  beforeEach(async () => {

    commonServiceMock = {
      getRole: jest.fn(),
      setCategoryDetails: jest.fn(),
      getCategoryDetails: jest.fn(),
      setUserInfo:jest.fn()
    };

    apiServiceMock = {
      getCategory: jest.fn(),
      addCategory: jest.fn(),
      editTask:jest.fn(),
      addTask:jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AddEditTaskComponent],
      imports: [MaterialModule, HttpClientModule, NoopAnimationsModule],
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
          provide: MatDialogRef,useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditTaskComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verifyRole to set role',()=>{
    const role =  "admin";
    const userRole ={
      role: "admin",
      email: "admin@gmail.com",
      id: "a76f",
      name: "admin"
    };
    const detail= JSON.stringify(userRole)
    sessionStorage.setItem("userDetails",detail)
    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(role);
    component['verifyRole']();
    expect(component.role).toEqual(role);
  });

  it('should verifyRole to set disableUserAccess as false for admin access',()=>{
    const role =  "admin";
    const userRole ={
      role: "admin",
      email: "admin@gmail.com",
      id: "a76f",
      name: "admin"
    };
    const detail= JSON.stringify(userRole)
    sessionStorage.setItem("userDetails",detail)
    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(role);
    component['verifyRole']();
    expect(component.disableUserAccess).toBeFalsy();
  });

  it('should verifyRole to set disableUserAccess as true for user access',()=>{
    const role =  "admin";
    const userRole ={
      role: "user",
      email: "user@gmail.com",
      id: "a76f",
      name: "user1"
    };
    const detail= JSON.stringify(userRole)
    sessionStorage.setItem("userDetails",detail)
    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(role);
    component['verifyRole']();
    expect(component.disableUserAccess).toBeTruthy();
  });

  it('should add task api call if isEditable is false',()=>{
    const taskDetail =  {
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    };
    component.addEditData.isEditable = false;
    jest.spyOn(apiServiceMock,'addTask').mockReturnValue(of(taskDetail));
    const consoleSpy = jest.spyOn(console, 'log');
    component.onSubmit();
    expect(consoleSpy).toHaveBeenCalledWith("success resp",taskDetail)
  });

  it('should addtask api method failure path', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    })
    jest.spyOn(apiServiceMock,'addTask').mockReturnValue(throwError(() => errorResponse));
    jest.spyOn(component['_snackBar'], 'open').mockImplementation();
    component.onSubmit();
    expect(component['_snackBar'].open).toHaveBeenCalled();
  });

  // it('should edit task api call if isEditable is true',()=>{
  //   const taskDetail =  {
  //     "title": "Task1",
  //     "description": "Task1",
  //     "dueDate": "2024-12-11T18:30:00.000Z",
  //     "priority": "High",
  //     "status": " In Progress",
  //     "assignTo": "user1",
  //     "categoryId": "b9fd",
  //     "id": "dc2c"
  //   };
  //   // component.addEditData.taskInfo['id'] = 'dc2c';
  //   component.addEditData.isEditable = true;
  //   jest.spyOn(apiServiceMock,'editTask').mockReturnValue(of(taskDetail));
  //   const consoleSpy = jest.spyOn(console, 'log');
  //   component.onSubmit();
  //   expect(consoleSpy).toHaveBeenCalledWith("success resp",taskDetail)
  //   // const taskDetailUpdate = {
  //   //   ...taskDetail,
  //   //   id:'dc2c'
  //   // }
  //   // component.onSubmit();
  // })
});
