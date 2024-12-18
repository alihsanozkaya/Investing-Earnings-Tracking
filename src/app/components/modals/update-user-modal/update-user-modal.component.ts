import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateUserDto } from '../../../dtos/update-user-dto';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css'],
})
export class UpdateUserModalComponent implements OnInit {
  userForm: FormGroup;
  @Input() user!: UpdateUserDto;
  @Output() userUpdated = new EventEmitter<UpdateUserDto>();
  @Output() userDeleted = new EventEmitter<number>();

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      deposited: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d+$/)]],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        deposited: this.user.deposited
      });
    }
  }

  updateUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    const updatedUser: UpdateUserDto = {
      ...this.user,
      ...this.userForm.value
    };

    this.userUpdated.emit(updatedUser);
    this.activeModal.close();
  }

  deleteUser() {
    const confirmDelete = window.confirm(
      'Bu kullanıcıyı silmek istediğinize emin misiniz?'
    );
    if (confirmDelete) {
      this.userDeleted.emit(this.user.id);
      this.activeModal.close();
    }
  }

  clearError(controlName: string) {
    this.userForm.get(controlName)?.markAsPristine();
  }
}
