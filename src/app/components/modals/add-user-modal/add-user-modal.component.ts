import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddUserDto } from '../../../dtos/add-user-dto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
})
export class AddUserModalComponent {
  userForm: FormGroup;
  @Output() userAdded = new EventEmitter<AddUserDto>();

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      deposited: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d+$/)]],
    });
  }

  addUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    this.userAdded.emit(this.userForm.value);
    this.activeModal.close();
  }

  clearError(controlName: string) {
    this.userForm.get(controlName)?.markAsPristine();
  }
}
