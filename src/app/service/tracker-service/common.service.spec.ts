import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import { Category } from '../../interface/api-response-interface';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setCategoryDetails set category',()=>{
    const categoryInfo = {
      "id": "b9fd",
      "title": "Category C",
      "description": "Category C"
    };
    service.setCategoryDetails(categoryInfo);
    service['category'].subscribe({
      next:(data:Category)=>{
        expect(service['category']).toBe(data)
      }
    })

  });
  it('should setUserInfo in sessionStorage', () => {
    const userInfo = {
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }
    service.setUserInfo(userInfo);
    expect(sessionStorage.getItem('userDetails')).toBe(JSON.stringify(userInfo))
  });

  it('should getRole from sessionStorage', () => {
    const userInfo = {
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }
    service.setUserInfo(userInfo);

    expect(service.getRole()).toEqual('admin')
  });

  it('should getUserName from sessionStorage', () => {
    const userInfo = {
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }
    service.setUserInfo(userInfo);

    expect(service.getUserName()).toEqual('admin')
  });

  it('should clearSessionStorage from sessionStorage', () => {
    const userInfo = {
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }
    service.setUserInfo(userInfo);
    service.clearSessionStorage();
    expect(sessionStorage.getItem('userDetails')).toBeFalsy();
  });
  
});
