/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SideNavService } from '../../service/side-nav/side-nav.service';
import { AuthenticationService } from '../../service/auth/authentication.service';
import { MaterialModule } from '../../modules/material/material.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let sideNavServiceMock:any;
  let authServiceMock:any;

  beforeEach(async () => {
    sideNavServiceMock = {
      toggle: jest.fn(),
    };

    authServiceMock = {
      logout:jest.fn()
    }
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: AngularFireAuth, useValue: {} },
        { provide: Auth, useValue: {} },
        {
          provide: SideNavService, useValue: sideNavServiceMock
        },
        {
          provide: AuthenticationService, useValue: authServiceMock
        }

      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clickMenu call toggle from sideNavService',()=>{
    const toggle = jest.spyOn(sideNavServiceMock,'toggle');
    component.clickMenu();
    expect(toggle).toHaveBeenCalled();
  })

  it('should logout call logout from authervice',()=>{
    const logout = jest.spyOn(authServiceMock,'logout');
    component.logout();
    expect(logout).toHaveBeenCalled();
  })
});
