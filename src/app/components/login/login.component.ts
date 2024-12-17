import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleApiService } from "../../service/handle-api/handle-api.service";
import { AuthenticationService } from '../../service/auth/authentication.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Constants, snackBarConfig } from '../../interface/constants';
import { map, switchMap } from 'rxjs';
import { CommonService } from '../../service/tracker-service/common.service';
import { UserList } from '../../interface/api-response-interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private formBuilder: FormBuilder, private route: Router, private authService: AuthenticationService,
    private apiService: HandleApiService, private common:CommonService
  ) { }

  public showSpinner = false;
  private _snackBar = inject(MatSnackBar);
  private config: MatSnackBarConfig = snackBarConfig;
  public loginForm = this.formBuilder.group({
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public onSubmit(): void {
    console.log("sub", this.loginForm.value);
    this.showSpinner = true;

    this.authService.login(this.loginForm.value).pipe(
      switchMap(loginData=>this.apiService.verifyUser(this.loginForm.value.emailId).pipe(
        map((userDetails:UserList[]) =>({loginData,userDetails}))
      ))
    ).subscribe({
      next: (data) => {
        console.log("login data",data);
        this.common.setUserInfo(data.userDetails[0]);
        this.showSpinner = false;
        this.route.navigate(["/tasktracker/dashboard"]);
      }, error: (err) => {
        console.log("err", err);
        this.showSpinner = false;
        this._snackBar.open(Constants.credentialIncorrect, "", this.config);
      }
    })


  }
}
