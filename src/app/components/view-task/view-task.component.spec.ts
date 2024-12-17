/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskComponent } from './view-task.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from '../../modules/material/material.module';
import { HandleApiService } from '../../service/handle-api/handle-api.service';
import { CommonService } from '../../service/tracker-service/common.service';
import { MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

class MatSnackBarMock {
  open() {
    return {
      afterClosed: () => of({})
    };
  }
}

describe('ViewTaskComponent', () => {
  let component: ViewTaskComponent;
  let fixture: ComponentFixture<ViewTaskComponent>;
  let apiServiceMock: any;
  let commonServiceMock: any;

  beforeEach(async () => {

    commonServiceMock = {
      getRole: jest.fn(),
      setCategoryDetails: jest.fn(),
      getCategoryDetails: jest.fn(),
    };
    apiServiceMock = {
      getCategory: jest.fn(),
      getTaskList: jest.fn(),
      getSort: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ViewTaskComponent],
      imports: [MaterialModule, HttpClientModule, MatSnackBarModule,MatDialogModule],
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
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewTaskComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verifyRole to set role', () => {
    const role =  "admin";
    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(role);
    component['verifyRole']();
    expect(component.role).toEqual(role);
  }
  )

  it('should set displayedColumns along with delete option for admin previlage', () => {
    const role = "admin";
    const column = ['Title', 'Description', 'AssignedTo', 'Priority', 'DueDate', 'Status', 'edit', 'delete'];
    jest.spyOn(commonServiceMock, 'getRole').mockReturnValue(role);
    component['verifyRole']();
    expect(component.displayedColumns).toEqual(column)
  })

  it('should sort the task list in ascending based on dueDate', () => {
    const sortTaskListAsscending = [
      {
        "id": "a3b2",
        "title": "Task2",
        "description": "Task2",
        "dueDate": "2024-12-03T18:30:00.000Z",
        "priority": "Medium",
        "status": " In Progress",
        "assignTo": "user1",
        "categoryId": "b9fd"
      },
      {
        "title": "Task3",
        "description": "Task3",
        "dueDate": "2024-12-03T18:30:00.000Z",
        "priority": "High",
        "status": "To Do",
        "assignTo": "user2",
        "categoryId": "b9fd",
        "id": "75e1"
      }
    ]
    component.categoryInfo = {
      "id": "b9fd",
      "title": "Category C",
      "description": "Category C"
    };
    jest.spyOn(apiServiceMock, 'getSort').mockReturnValue(of(sortTaskListAsscending))
    component.sort('ascending',);
    expect(component.dataSource.data).toBe(sortTaskListAsscending)

  })

  it('should sort the task list in decending based on dueDate', () => {
    const sortTaskListDecending = [
      {
        "id": "fb89",
        "title": "new t1",
        "description": "new t1",
        "dueDate": "2024-12-12T18:30:00.000Z",
        "priority": "Low",
        "status": "To Do",
        "assignTo": "user1",
        "categoryId": "72a6"
      },
      {
        "title": "New task1",
        "description": "New task1",
        "dueDate": "2024-12-12T18:30:00.000Z",
        "priority": "High",
        "status": " In Progress",
        "assignTo": "user1",
        "categoryId": "b9fd",
        "id": "0652"
      }
    ];
    component.categoryInfo = {
      "id": "b9fd",
      "title": "Category C",
      "description": "Category C"
    };
    jest.spyOn(apiServiceMock, 'getSort').mockReturnValue(of(sortTaskListDecending))
    component.sort('descending');
    expect(component.dataSource.data).toBe(sortTaskListDecending)

  })

  it('should test sort api call method failure path', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    })
    component.categoryInfo = {
      "id": "b9fd",
      "title": "Category C",
      "description": "Category C"
    };
    jest.spyOn(apiServiceMock, 'getSort').mockReturnValue(throwError(() => errorResponse));
    jest.spyOn(component['_snackBar'], 'open').mockImplementation();
    component.sort('decending');
    expect(component['_snackBar'].open).toHaveBeenCalled();
  });

  it('should getCategoryTaskInfo to set the dataSource', () => {
    const categoryInfo = {
      "id": "b9fd",
      "title": "Category C",
      "description": "Category C"
    };
    jest.spyOn(commonServiceMock, 'getCategoryDetails').mockReturnValue(of(categoryInfo));
    commonServiceMock.getCategoryDetails().subscribe({
      next: (data: any) => {
        expect(data).toBe(categoryInfo);
        expect(component.categoryInfo).toBe(data);
        // done();
      },
      error: (error: any) => {
        console.log(error);

      }
    })
  });

  it('should getTaskList to set the dataSource', (done) => {
    const taskList = [
      {
        "id": "fb89",
        "title": "new t1",
        "description": "new t1",
        "dueDate": "2024-12-12T18:30:00.000Z",
        "priority": "Low",
        "status": "To Do",
        "assignTo": "user1",
        "categoryId": "72a6"
      }]
    jest.spyOn(apiServiceMock, 'getTaskList').mockReturnValue(of(taskList));
    apiServiceMock.getTaskList().subscribe({
      next: (data: any) => {
        expect(data).toBe(taskList);
        done();
      },
      error: (error: any) => {
        console.log(error);

      }
    })
  });
});

