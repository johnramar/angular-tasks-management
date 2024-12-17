/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  public sideNavToggleSubject = new BehaviorSubject<any>(null);


  public toggle() {
    return this.sideNavToggleSubject.next(null);
  }
}
