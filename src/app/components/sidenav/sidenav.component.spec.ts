import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { Router } from '@angular/router';
import { MaterialModule } from '../../modules/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: Router;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      imports: [
        MaterialModule,NoopAnimationsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleNavigation redirect to dashboard',()=>{
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.handleNavigation("tasktracker/dashboard")
    expect(navigateSpy).toHaveBeenCalledWith(["tasktracker/dashboard"])
  })


});
