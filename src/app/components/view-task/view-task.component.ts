/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AddEditTaskComponent } from './add-edit-task/add-edit-task.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../service/tracker-service/common.service';
import { Category, task } from '../../interface/api-response-interface';
import { Constants, snackBarConfig } from '../../interface/constants';
import { HandleApiService } from '../../service/handle-api/handle-api.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, Subject, switchMap, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})

export class ViewTaskComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  constructor(private matDialog: MatDialog, private commonService: CommonService,
    private apiService: HandleApiService, private formBuilder: FormBuilder
  ) { }
  private taskList: task[] = [];

  public displayedColumns: string[] = ['Title', 'Description', 'AssignedTo', 'Priority', 'DueDate', 'Status','edit'];
  public titleFilter = new FormControl('');
  public dataSource = new MatTableDataSource();

  private matDialogRef!: MatDialogRef<AddEditTaskComponent>;
  private matDialogDeleteRef!: MatDialogRef<DeleteConfirmationComponent>;
  public categoryInfo!: Category;
  private _snackBar = inject(MatSnackBar);
  private config: MatSnackBarConfig = snackBarConfig;
  private filterTask = {
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    assignTo: '',
    categoryId: ''
  }
  private destroy$ = new Subject<void>();
  public sortToggle = true;
  public role  = '';

  ngOnInit() {
    this.verifyRole();
    this.getCategoryTaskInfo();
  }


  public getCategoryTaskInfo():void {
    this.commonService.getCategoryDetails.pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((categoryInfo: Category) => this.apiService.getTaskList(categoryInfo.id).pipe(
        map((taskList: task[]) => ({ categoryInfo, taskList }))
      ))
    ).subscribe({
      next: (data) => {
        console.log("merged data", data);
        this.categoryInfo = data.categoryInfo;
        this.taskList = data.taskList;
        this.dataSource.data = this.taskList;
        this.searchByTitle();
        this.dataSource.filterPredicate = this.createFilter();
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  public addTask():void {
    this.matDialogRef = this.matDialog.open(AddEditTaskComponent, {
      disableClose: true,
      data: { title: "Add Task", isEditable: false }
    });
    this.matDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getCategoryTaskInfo();
      }

    });
  }

  public editTask(taskDetails: string):void {
    console.log("taskDetails", taskDetails);

    this.matDialogRef = this.matDialog.open(AddEditTaskComponent, {
      disableClose: true,
      data: { title: "Edit Task", taskInfo: taskDetails, isEditable: true }
    });
    this.matDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getCategoryTaskInfo();
      }

    });
  }

  public deleteTask(taskId: string):void {
    console.log("taskId", taskId);
    this.matDialogDeleteRef = this.matDialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: { message: Constants.deleteTaskMessage, confirm: Constants.taskDelete }
    });
    this.matDialogDeleteRef.afterClosed().subscribe(result => {
      console.log("res==>", result);
      if (result === Constants.taskDelete) {
        this.apiService.deleteTask(taskId).subscribe({
          next: (data) => {
            console.log("task deleted", data);
            this.getCategoryTaskInfo();
          },
          error: (error) => {
            console.log("err", error);
            this._snackBar.open(Constants.errorMessge, "", this.config);
          }
        }
        );
      }
    });
  }

  public searchByTitle():void {
    this.titleFilter.valueChanges.pipe(
      takeUntil(this.destroy$))
      .subscribe(
        title => {
          this.filterTask.title = title || '';
          this.dataSource.filter = JSON.stringify(this.filterTask);
        }
      )
  }

  private createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = (data: any, filter: any): boolean => {
      const searchTerms = JSON.parse(filter);
      return data.title.toLowerCase().indexOf(searchTerms.title) !== -1
    }
    return filterFunction;
  }

  public sort(params:string):void {
    const sort = params === "ascending"? '' : "-";
    this.sortToggle = !this.sortToggle;

    this.apiService.getSort(sort, this.categoryInfo.id).subscribe(
      {
        next: (data) => {
          console.log("success resp", data);
          this.dataSource.data = data;
        },
        error: (error) => {
          console.log("err", error);
          this._snackBar.open(Constants.errorMessge, "", this.config);
        }
      })
  }

  private verifyRole():void{
    this.role = this.commonService.getRole();
    const adminColumn = [...this.displayedColumns, 'delete'];    
    this.displayedColumns =  this.role === "admin"? adminColumn : this.displayedColumns ;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}