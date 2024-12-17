import { Component } from '@angular/core';
import { SideNavService } from '../../service/side-nav/side-nav.service';
import { AuthenticationService } from '../../service/auth/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private sideNavService: SideNavService,private authService: AuthenticationService ) {

  }

  public clickMenu():void {
    this.sideNavService.toggle();
  }

  public logout(){
    this.authService.logout()
  }

}
