import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ViewTaskComponent } from '../../view-task/view-task.component';
import { SidenavComponent } from '../sidenav.component';
import { authGuard } from '../../../service/auth/auth.guard';



const routes: Routes = [
  {
    path: '', component: SidenavComponent, children: [
      { path: 'dashboard', component: DashboardComponent,canActivate:[authGuard] },
      { path: 'view-task', component: ViewTaskComponent,canActivate:[authGuard] }
    ]
  }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskTrackerRoutingModule { }
