import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AddInterestDto } from '../../../dtos/add-interest-dto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';

@Component({
  selector: 'app-add-interest-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-interest-modal.component.html',
  styleUrls: ['./add-interest-modal.component.css'],
})
export class AddInterestModalComponent {
  interestForm: FormGroup;
  @Input() users: User[] = [];
  @Output() interestAdded = new EventEmitter<AddInterestDto>();

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.interestForm = this.fb.group({
      name: ['', Validators.required],
      buyPrice: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d+$/)]],
      sellPrice: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d+$/)]],
      unit: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
      userId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  addInterest() {
    if (this.interestForm.invalid) {
      this.interestForm.markAllAsTouched();
      return;
    }

    this.interestAdded.emit(this.interestForm.value);
    this.activeModal.close();
  }

  clearError(controlName: string) {
    this.interestForm.get(controlName)?.markAsPristine();
  }
}