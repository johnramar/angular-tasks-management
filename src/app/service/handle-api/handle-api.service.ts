/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category, task, UserList } from '../../interface/api-response-interface';
import { CommonService } from '../tracker-service/common.service';
import { roleTypeConstants } from '../../interface/constants';

@Injectable({
  providedIn: 'root'
})
export class HandleApiService {

  constructor(private http: HttpClient, private commonService: CommonService) { }
  serverUrl = "http://localhost:3000/";

  addCategory(requestBody: any): Observable<any> {
    console.log("api call", requestBody);
    return this.http.post(`${this.serverUrl}category`, requestBody);
  }

  getCategory(): Observable<[Category]> {
    return this.http.get(`${this.serverUrl}category`).pipe(map((response: any) => response));
  }

  deleteCategory(categoryId: string): Observable<Category> {
    return this.http.delete(`${this.serverUrl}category/${categoryId}`).pipe(map((response: any) => response));
  }

  getUserList(): Observable<[UserList]> {
    return this.http.get(`${this.serverUrl}users?role=user`).pipe(map((response: any) => response));
  }

  addTask(requestBody: any): Observable<any> {
    console.log("api call", requestBody);
    return this.http.post(`${this.serverUrl}task`, requestBody);
  }

  getTaskList(categoryId: string | undefined): Observable<[task]> {
    const role = this.commonService.getRole();
    let url = ''
    console.log("role ==>",role);
    
    if (role === roleTypeConstants.admin) {
      console.log("admin ==>");
      
      url = `${this.serverUrl}task?categoryId=${categoryId}`
    } else {
      console.log("else ==>");
      
      const userName = this.commonService.getUserName();
      url = `${this.serverUrl}task?categoryId=${categoryId}&assignTo=${userName}`
    }
    return this.http.get(url).pipe(map((response: any) => response));
  }

  deleteTask(taskId: string): Observable<Category> {
    return this.http.delete(`${this.serverUrl}task/${taskId}`).pipe(map((response: any) => response));
  }

  editTask(requestBody: any, taskId: string): Observable<any> {
    return this.http.put(`${this.serverUrl}task/${taskId}`, requestBody);
  }

  getSort(params: string, categoryId: string | undefined): Observable<task[]> {

    const role = this.commonService.getRole();
    let url = ''
    if (role === roleTypeConstants.admin) {
      url = `${this.serverUrl}task?_sort=${params}dueDate`;
    } else {
      const userName = this.commonService.getUserName();
      url = `${this.serverUrl}task?categoryId=${categoryId}&assignTo=${userName}&_sort=${params}dueDate`

    }
    return this.http.get(url).pipe(map((response: any) => response));
  }

  verifyUser(emailId: any): Observable<UserList[]> {
    return this.http.get(`${this.serverUrl}users?email=${emailId}`).pipe(map((response: any) => response));
  }

}
