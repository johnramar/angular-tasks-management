import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ViewTaskComponent } from '../../view-task/view-task.component';
import { TaskTrackerRoutingModule } from './task-tracker-routing.module';
import { HeaderComponent } from '../../header/header.component';
import { MaterialModule } from '../../../modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddCategoryComponent } from '../../dashboard/add-category/add-category.component';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { AddEditTaskComponent } from '../../view-task/add-edit-task/add-edit-task.component';



@NgModule({
  declarations: [
    SidenavComponent,
    DashboardComponent,
    ViewTaskComponent,
    HeaderComponent,
    AddEditTaskComponent,
    AddCategoryComponent,
    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule,
    TaskTrackerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class TaskTrackerModule { }
