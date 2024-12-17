/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandleApiService } from './handle-api.service';
import { of } from 'rxjs';

describe('HandleApiService', () => {
  let service: HandleApiService;
  let httpClientSpy: any;
  let commonServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      put: jest.fn()
    };

    commonServiceSpy = {
      getRole: jest.fn(),
      getUserName: jest.fn(),
    }


    service = new HandleApiService(httpClientSpy, commonServiceSpy)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test addCategory', () => {
    const expectResp = {
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    };
    jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(expectResp));
    service.addCategory(expectResp);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
  });
  it('should test getCategory', () => {
    const expectResp = [{
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    }];
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.getCategory().subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.get).toEqual(data);
        }
      }
    );
  });

  it('should test deleteCategory', () => {
    const categoryId = "39fb"
    const expectResp = [{
      "id": "39fb",
      "title": "Category A",
      "description": "Category A"
    }];
    jest.spyOn(httpClientSpy, 'delete').mockReturnValue(of(expectResp));
    service.deleteCategory(categoryId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.delete).toEqual(data);
        }
      }
    );
  });

  it('should test getUserList', () => {
    const expectResp = [{
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }];
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.getUserList().subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.delete).toEqual(data);
        }
      }
    );
  });

  it('should test addTask', () => {
    const expectResp = {
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    };
    jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(expectResp));
    service.addTask(expectResp).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.post).toEqual(data);
        }
      }
    );;

    expect(httpClientSpy.post).toHaveBeenCalledTimes(1)
  });

  it('should test getTaskList for admin role', () => {
    const categoryId = "39fb";
    const role = "admin";

    const expectResp = [{
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    }];
    jest.spyOn(commonServiceSpy, 'getRole').mockReturnValue(role);
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.getTaskList(categoryId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.post).toEqual(data);
        }
      }
    );;

    expect(httpClientSpy.get).toHaveBeenCalledWith(`${service.serverUrl}task?categoryId=${categoryId}`)
  });

  it('should test getTaskList for user role', () => {
    const categoryId = "39fb";
    const role = "user";
    const userName = "user1"
    const expectResp = [{
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    }];
    jest.spyOn(commonServiceSpy, 'getRole').mockReturnValue(role);
    jest.spyOn(commonServiceSpy, 'getUserName').mockReturnValue(userName);
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.getTaskList(categoryId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.post).toEqual(data);
        }
      }
    );;

    expect(httpClientSpy.get).toHaveBeenCalledWith(`${service.serverUrl}task?categoryId=${categoryId}&assignTo=${userName}`)
  });

  it('should test deleteTask', () => {
    const taskId = "dc2c"
    const expectResp = {
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    };
    jest.spyOn(httpClientSpy, 'delete').mockReturnValue(of(expectResp));
    service.deleteTask(taskId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.delete).toEqual(data);
        }
      }
    );
  });

  it('should test editTask', () => {
    const taskId = "dc2c"
    const expectResp = {
      "title": "Task1 Edited",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    };
    jest.spyOn(httpClientSpy, 'put').mockReturnValue(of(expectResp));
    service.editTask(expectResp, taskId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.delete).toEqual(data);
        }
      }
    );
  });

  it('should test getSort for admin role', () => {
    const categoryId = "39fb";
    const role = "admin";
    const params = "-"
    const expectResp = [{
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    }];
    jest.spyOn(commonServiceSpy, 'getRole').mockReturnValue(role);
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.getSort(params, categoryId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.post).toEqual(data);
        }
      }
    );;

    expect(httpClientSpy.get).toHaveBeenCalledWith(`${service.serverUrl}task?_sort=${params}dueDate`)
  });

  it('should test getSort for user role', () => {
    const categoryId = "39fb";
    const role = "user";
    const params = ""
    const userName = "user1"
    const expectResp = [{
      "title": "Task1",
      "description": "Task1",
      "dueDate": "2024-12-11T18:30:00.000Z",
      "priority": "High",
      "status": " In Progress",
      "assignTo": "user1",
      "categoryId": "b9fd",
      "id": "dc2c"
    }];
    jest.spyOn(commonServiceSpy, 'getRole').mockReturnValue(role);
    jest.spyOn(commonServiceSpy, 'getUserName').mockReturnValue(userName);
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.getSort(params, categoryId).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.post).toEqual(data);
        }
      }
    );;

    expect(httpClientSpy.get).toHaveBeenCalledWith(`${service.serverUrl}task?categoryId=${categoryId}&assignTo=${userName}&_sort=${params}dueDate`)
  });

  it('should test verifyUser', () => {
    const email = "admin@gmail.com";
    const expectResp =  [{
      "role": "admin",
      "email": "admin@gmail.com",
      "id": "a76f",
      "name": "admin"
    }];
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(expectResp));
    service.verifyUser(email).subscribe(
      {
        next: (data) => {
          expect(httpClientSpy.get).toEqual(data);
        }
      }
    );
  });
});
