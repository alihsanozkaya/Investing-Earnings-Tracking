import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpdateInterestDto } from '../../../dtos/update-interest-dto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-interest-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-interest-modal.component.html',
  styleUrl: './update-interest-modal.component.css'
})
export class UpdateInvestingModalComponent implements OnInit {
  interestForm: FormGroup;
  @Input() interest!: UpdateInterestDto;
  @Input() users: User[] = [];
  @Output() interestUpdated = new EventEmitter<UpdateInterestDto>();
  @Output() interestDeleted = new EventEmitter<number>();

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.interestForm = this.fb.group({
      name: ['', Validators.required],
      buyPrice: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d+$/)]],
      sellPrice: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d+$/)]],
      unit: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
      userId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    if (this.interest) {
      this.interestForm.patchValue({
        name: this.interest.name,
        buyPrice: this.interest.buyPrice,
        sellPrice: this.interest.sellPrice,
        unit: this.interest.unit,
        userId: this.interest.userId
      });
    }
  }

  updateInterest() {
    if (this.interestForm.invalid) {
      this.interestForm.markAllAsTouched();
      return;
    }
    
    const updatedInterest: UpdateInterestDto = {
      ...this.interest,
      ...this.interestForm.value
    };

    this.interestUpdated.emit(updatedInterest);
    this.activeModal.close();
  }

  deleteInterest() {
    const confirmDelete = window.confirm(
      'Bu hisseyi silmek istediğinize emin misiniz?'
    );
    if (confirmDelete) {
      this.interestDeleted.emit(this.interest.id);
      this.activeModal.close();
    }
  }

  clearError(controlName: string) {
    this.interestForm.get(controlName)?.markAsPristine();
  }
}
