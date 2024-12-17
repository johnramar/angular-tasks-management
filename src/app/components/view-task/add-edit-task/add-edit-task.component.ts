/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { HandleApiService } from '../../../service/handle-api/handle-api.service';
import { addEditTask, Category, task, UserList } from '../../../interface/api-response-interface';
import { Constants, snackBarConfig } from '../../../interface/constants';
import { CommonService } from '../../../service/tracker-service/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.css'
})
export class AddEditTaskComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private route: Router, private apiService: HandleApiService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AddEditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public addEditData: addEditTask,
  ) { }

  public addTaskForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
    priority: ['', Validators.required],
    status: ['', Validators.required]
  });
  public priorityList = ["Low", "Medium", "High"];
  public statusList = ["To Do", " In Progress", "Done"];
  public assignUserControl = new FormControl('');
  public usersList1: UserList[] = []
  public userFilteredOptions: Observable<UserList[]> | undefined;
  categoryInfo: Category = {};
  private taskList: task[] = [];
  public alreadyExist = false;
  private _snackBar = inject(MatSnackBar);
  private config: MatSnackBarConfig = snackBarConfig;
  private destroy$ = new Subject<void>();
  private ngUnsubscribe = new Subject<void>();
  public role  = '';
  public disableUserAccess = false;

  ngOnInit() {
    this.verifyRole();
    this.getCategoryUserTaskInfo();
  }

  public getCategoryUserTaskInfo() {

    this.commonService.getCategoryDetails.pipe(
      takeUntil(this.destroy$),
      switchMap((categoryInfo: Category) => this.apiService.getUserList().pipe(
        switchMap(userList => this.apiService.getTaskList(categoryInfo.id).pipe(
          map(taskList => ({ categoryInfo, userList, taskList }))
        ))
      ))
    ).subscribe({
      next: (data) => {
        console.log("merged data", data);
        this.categoryInfo = data.categoryInfo;
        this.usersList1 = data.userList;
        this.taskList = data.taskList;
        this.userListFilter()
      },
      error: (error) => {
        console.log("error", error);
        this._snackBar.open(Constants.errorMessge, "", this.config);
      }

    });
  }


  public userListFilter() {

    this.userFilteredOptions = this.assignUserControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      startWith(''),
      map(value => {
        console.log("typed", value);

        return this._filter(value || '')
      }
      ),
    );
  }


  private _filter(value: string): UserList[] {
    const filterValue = value.toLowerCase();
    return this.usersList1.filter((option) => {
      console.log("option", option);
      return option.name.toLowerCase().includes(filterValue)

    });
  }

  public onSubmit(): void {
    const taskDetail = {
      ...this.addTaskForm.value,
      assignTo: this.assignUserControl.value,
      categoryId: this.categoryInfo.id
    }


    if (this.addEditData.isEditable) {
      const taskDetailUpdate = {
        ...taskDetail,
        id: this.addEditData.taskInfo.id
      }
      this.apiService.editTask(taskDetailUpdate, this.addEditData.taskInfo.id).subscribe(
        {
          next: (data) => { console.log("success resp", data) },
          error: (error) => {
            console.log("err", error);
            this._snackBar.open(Constants.errorMessge, "", this.config);
          }
        })
    } else {

      this.apiService.addTask(taskDetail).subscribe(
        {
          next: (data) => { console.log("success resp", data) },
          error: (error) => {
            console.log("err", error);
            this._snackBar.open(Constants.errorMessge, "", this.config);
          }
        })
    }
  }

  public titleChange() {
    console.log("input change", this.addTaskForm.value.title);
    const verifyTitleExist = this.taskList.find((list: any) => list.title === this.addTaskForm.value.title);
    console.log("verifyTitleExist", verifyTitleExist);
    this.alreadyExist = verifyTitleExist ? true : false;
  }

  private verifyRole():void{
    this.role = this.commonService.getRole();
    this.disableUserAccess = this.role === 'user' ? true : false
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
