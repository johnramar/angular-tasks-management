/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleApiService } from '../../../service/handle-api/handle-api.service';
import { Category } from '../../../interface/api-response-interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Constants, snackBarConfig } from '../../../interface/constants';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private route: Router, private apiService: HandleApiService) { }

  public addCategoryForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });
  public alreadyExist = false;
  private categoryList: Category[] = [];
  private _snackBar = inject(MatSnackBar);
  private config: MatSnackBarConfig = snackBarConfig;

  ngOnInit() {
    this.getCategoryList();
  }

  public getCategoryList() {
    this.apiService.getCategory().subscribe(
      {
        next: (List) => {
          this.categoryList = List;
        }, error: (error) => {
          console.log("err", error);
          this._snackBar.open(Constants.errorMessge, "", this.config);
        }
      })
  }
  public onSubmit(): void {
    this.apiService.addCategory(this.addCategoryForm.value).subscribe(
      {
        next: (data) => {
          console.log("success resp", data);
        }, error: (error) => {
          console.log("err", error);
          this._snackBar.open(Constants.errorMessge, "", this.config);
        }
      }
    )
  }

  public titleChange() {
    console.log("input change", this.addCategoryForm.value.title);
    const verifyTitleExist = this.categoryList.find((list: any) => list.title === this.addCategoryForm.value.title);
    console.log("verifyTitleExist", verifyTitleExist);
    this.alreadyExist = verifyTitleExist ? true : false;
  }
}
