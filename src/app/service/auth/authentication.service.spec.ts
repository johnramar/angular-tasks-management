import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  getIdTokenResult,
  user, UserCredential
} from '@angular/fire/auth';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

jest.mock('@angular/fire/auth', () => {
  return {
    Auth: jest.fn(), // Mock the Auth class
    getIdTokenResult: jest.fn(), // Mock the getIdTokenResult function
    sendPasswordResetEmail: jest.fn(), // Mock the sendPasswordResetEmail function
    signInWithEmailAndPassword: jest.fn(), // Mock the signInWithEmailAndPassword function
    signOut: jest.fn(), // Mock the signOut function
    user: jest.fn(() => of(null)), // Mock the user observable, returning a null user by default
  };
});

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let authMock: jest.Mocked<Auth>;


  beforeEach(() => {

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({} as UserCredential); // Mock the return value
    (signOut as jest.Mock).mockResolvedValue(undefined);
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
    (getIdTokenResult as jest.Mock).mockResolvedValue({
      claims: {
        role: 'user',
      },
    });
    (user as jest.Mock).mockReturnValue(of(null)); // Mock the user observable to return null



    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: AngularFireAuth, useValue: {} },
        { provide: Auth, useValue: authMock },
      ]
    });
    service = TestBed.inject(AuthenticationService);
    authMock = TestBed.inject(Auth) as jest.Mocked<Auth>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should login the user', async () => {
  //   const credentials = { email: 'test@example.com', password: 'password' };
  //   await service.login(credentials);
  //   // expect(signInWithEmailAndPassword).toHaveBeenCalled();
  //   expect(signInWithEmailAndPassword).toHaveBeenCalledWith(authMock, credentials.email, credentials.password);
  // });

  // it('should log out the user', async () => {
  //   await service.logout();
  //   expect(signOut).toHaveBeenCalledWith(authMock);
  // });


});
