/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, from} from 'rxjs';
import { CommonService } from '../tracker-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private auth:AngularFireAuth, private route: Router,
    private common:CommonService
  ) { }

  login(requestBody:any):Observable<any>{
    console.log("api call login",requestBody);
    return  from(this.auth.signInWithEmailAndPassword(
      requestBody.emailId,requestBody.password
    ))
  }

  logout() {
    console.log("logout called");
    this.common.clearSessionStorage();
    this.auth.signOut();
    this.route.navigate(["/"]);
  }
}