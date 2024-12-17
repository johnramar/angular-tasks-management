/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoryComponent } from './add-category.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../../modules/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HandleApiService } from '../../../service/handle-api/handle-api.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

class MatSnackBarMock {
  open() {
    return {
      onAction: () => of({})
    };
  }
}

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let apiServiceMock: any;
  beforeEach(async () => {

    apiServiceMock = {
      getCategory: jest.fn(),
      addCategory: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AddCategoryComponent],
      imports: [MaterialModule, HttpClientModule, NoopAnimationsModule,ReactiveFormsModule],
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
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getCategory api call method return success to set categoryList', () => {
    const expectRes = [{
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    }];

    jest.spyOn(apiServiceMock, 'getCategory').mockReturnValue(of(expectRes));
    fixture.detectChanges();
    expect(component['categoryList']).toEqual(expectRes);
  });

  it('should getCategory api fails through error response', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    })
    jest.spyOn(apiServiceMock, 'getCategory').mockReturnValue(throwError(() => errorResponse));
    component.getCategoryList();
    expect(component['categoryList']).toEqual([]);
  });

  it('should test addCategory api call method success path', () => {
    const expectRes = [{
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    }];

    jest.spyOn(apiServiceMock, 'addCategory').mockReturnValue(of(expectRes));
    const consoleSpy = jest.spyOn(console, 'log');
    component.onSubmit();
    expect(consoleSpy).toHaveBeenCalledWith("success resp", [{ "description": "Category A", "id": "39fb", "title": "Category A" }]);
  });

  it('should test addCategory api call method failure path', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    })
    jest.spyOn(apiServiceMock, 'addCategory').mockReturnValue(throwError(() => errorResponse));
    jest.spyOn(component['_snackBar'], 'open').mockImplementation();
    component.onSubmit();
    expect(component['_snackBar'].open).toHaveBeenCalled();
  });

  it('should test titleChange and if title already exist then set alreadyExist value as true',()=>{
    const categoryListMock = [{
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    }];
    component.addCategoryForm.controls['title'].setValue('Category A');
    component['categoryList']=categoryListMock;
    component.titleChange();
    expect(component.alreadyExist).toBeTruthy()
  })

  it('should test titleChange and  if title already exist set alreadyExist value as false',()=>{
    const categoryListMock = [{
      "id": "39fb",
      "title": "Category B",
      "description": "Category A"
    }];
    component.addCategoryForm.controls['title'].setValue('Category A');
    component['categoryList']=categoryListMock;
    component.titleChange();
    expect(component.alreadyExist).toBeFalsy()
  })
});
