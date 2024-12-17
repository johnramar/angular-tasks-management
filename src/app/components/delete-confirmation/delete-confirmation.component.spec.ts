import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationComponent } from './delete-confirmation.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('DeleteConfirmationComponent', () => {
  let component: DeleteConfirmationComponent;
  let fixture: ComponentFixture<DeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[MatDialogModule],
      declarations: [DeleteConfirmationComponent],
      providers:[
        {
          provide: MatDialogRef,useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
