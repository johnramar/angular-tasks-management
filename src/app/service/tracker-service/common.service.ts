import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category, UserList } from '../../interface/api-response-interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private category = new BehaviorSubject({});
  getCategoryDetails = this.category.asObservable();

  public setCategoryDetails(CategoryInfo:Category):void{
    this.category.next(CategoryInfo);
  }

  public setUserInfo(details:UserList):void{
    const detail= JSON.stringify(details)
    sessionStorage.setItem("userDetails",detail)
  }

  public getRole(){
    const userInfo= JSON.parse(sessionStorage['userDetails']).role;
    return userInfo;
  }

  public getUserName(){
    const userInfo= JSON.parse(sessionStorage['userDetails']).name;
    return userInfo;
  }

  public clearSessionStorage(){
    sessionStorage.clear();
  }
}
