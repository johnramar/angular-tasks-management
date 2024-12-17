 
import { TestBed } from '@angular/core/testing';

import { SideNavService } from './side-nav.service';

describe('SideNavService', () => {
  let service: SideNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle set sideNavToggleSubject',()=>{
    service.toggle();
    service.sideNavToggleSubject.subscribe({
      next:()=>{
        expect (service.sideNavToggleSubject).toBeNull();
      }
    })
  })
});
