/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddCategoryComponent } from './add-category/add-category.component';
import { HandleApiService } from '../../service/handle-api/handle-api.service';
import { Category } from '../../interface/api-response-interface';
import { CommonService } from '../../service/tracker-service/common.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Constants, snackBarConfig } from '../../interface/constants';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  matDialogRef!: MatDialogRef<AddCategoryComponent>;
  matDialogDeleteRef!: MatDialogRef<DeleteConfirmationComponent>;

  constructor(private route: Router, private matDialog: MatDialog, private apiService: HandleApiService,
    private commonService: CommonService
  ) { }

  public categoryList: any[] = [];
  private readonly _snackBar = inject(MatSnackBar);
  private readonly config: MatSnackBarConfig = snackBarConfig;
  public role  = '';

  ngOnInit() {
    this.verifyRole();
    this.getCategory();

  }

  public getCategory(): void {
    this.apiService.getCategory().subscribe({
      next: (data) => {
        console.log("success resp", data);
        this.categoryList = data;
      },
      error: (error) => {
        console.log("err ==>", error);
        this._snackBar.open(Constants.errorMessge, "", this.config);
      }
    }

    )
  }
  public viewTask(categorySelected: Category): void {
    this.commonService.setCategoryDetails(categorySelected);
    this.route.navigate(["/tasktracker/view-task"]);
  }

  public addCategory(): void {
    this.matDialogRef = this.matDialog.open(AddCategoryComponent, {
      disableClose: true
    });
    this.matDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getCategory();
      }

    });
  }

  public deleteCategory(categoryId: string): void {
    this.matDialogDeleteRef = this.matDialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: { message: Constants.deleteCategoryMessage, confirm: Constants.categoryDelete }
    });
    this.matDialogDeleteRef.afterClosed().subscribe(result => {
      console.log("res==>", result);
      if (result === Constants.categoryDelete) {
        this.apiService.deleteCategory(categoryId).subscribe(
          {
            next: (data) => {
              console.log("category deleted", data);
              this.getCategory();
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

  private verifyRole(){
    this.role = this.commonService.getRole()
  }
}
