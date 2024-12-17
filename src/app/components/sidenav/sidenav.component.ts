import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavService } from '../../service/side-nav/side-nav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  
  public showSideNav = false;

  constructor(private route: Router,private sideNavService: SideNavService){}
 
  ngOnInit() { 
    this.sideNavService.sideNavToggleSubject.subscribe(()=> {
      this.showSideNav = !this.showSideNav
     });
   } 
 
  public handleNavigation(input:string) {
    console.log("input",input);
    this.route.navigate([input]);
  }
}
