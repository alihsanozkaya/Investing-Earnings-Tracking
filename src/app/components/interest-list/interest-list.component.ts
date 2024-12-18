import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Interest } from '../../models/Interest';
import { InterestService } from '../../services/interest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddInterestModalComponent } from '../modals/add-interest-modal/add-interest-modal.component';
import { AddInterestDto } from '../../dtos/add-interest-dto';
import { UpdateInterestDto } from '../../dtos/update-interest-dto';
import { UpdateInvestingModalComponent } from '../modals/update-interest-modal/update-interest-modal.component';
import { User } from '../../models/User';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interest-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.css'],
})
export class InterestListComponent implements OnInit {
  interests: Interest[] = [];
  @Input() users: User[] = [];
  selectedValue = "all";
  currentPage: number = 1;
  itemsPerPage: number = 9;
  sortColumn: string = '';
  sortDirection: boolean = true;

  constructor(
    private interestService: InterestService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadInterests();
  }

  onUserChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value;
    this.currentPage = 1;

    if (this.selectedValue === "all") {
      this.loadInterests();
    }
    else{
      this.getInterestsByUserIdAsync(Number(this.selectedValue));
    }
  }
  
  loadInterests() {
    this.interestService.getAllInterest().subscribe(data => {
      this.interests = data;
    });
  }

  getTotalProfit(): number {
    let totalProfit = 0;
  
    this.interests.forEach(interest => {
      const profit = (interest.sellPrice! - interest.buyPrice!) * interest.unit!;
      totalProfit += profit;
    });
  
    return totalProfit;
  }
  
  getTotalAmount(): number {
    let totalAmount = 0;
  
    this.interests.forEach(interest => {
      const amount = interest.sellPrice! * interest.unit!;
      totalAmount += amount;
    });
  
    return totalAmount;
  }

  getInterestsByUserIdAsync(userId: number) {
    this.interestService.getInterestsByUserIdAsync(userId).subscribe(data => {
      this.interests = data;
    });
  }

  openAddInterestModal() {
    const modalRef = this.modalService.open(AddInterestModalComponent);
    modalRef.componentInstance.users = this.users;
  
    modalRef.componentInstance.interestAdded.subscribe((interest: AddInterestDto) => {
      this.addInterest(interest);
    });
  }

  addInterest(interest: AddInterestDto) {
    this.interestService.addInterest(interest).subscribe({
      next: (response) => {
        this.interests.push(response);
      },
      error: (error) => {
        console.error('Error adding interest', error);
      },
    });
  }

  openUpdateInterestModal(interest: UpdateInterestDto) {
    const modalRef = this.modalService.open(UpdateInvestingModalComponent);
    modalRef.componentInstance.interest = { ...interest };
    modalRef.componentInstance.users = this.users;

    modalRef.componentInstance.interestUpdated.subscribe(
      (updatedInterest: UpdateInterestDto) => {
        this.updateInterest(updatedInterest);
      }
    );

    modalRef.componentInstance.interestDeleted.subscribe((interestId: number) => {
      this.deleteInterest(interestId);
    });
  }

  updateInterest(interest: UpdateInterestDto) {
    this.interestService.updateInterest(interest).subscribe({
      next: (response) => {
        const index = this.interests.findIndex(i => i.id === response.id);
        if (index !== -1) {
          this.interests[index] = response;
        }        
      },
      error: (error) => {
        console.error('Error updating interest', error);
      },
    });
  }

  deleteInterest(id: number) {
    this.interestService.deleteInterest(id).subscribe({
      next: (deletedId) => {
        this.interests = this.interests.filter(i => i.id !== deletedId);
      },
      error: (error) => {
        console.error('Error deleting interest', error);
      },
    });
  }

  pagedInterests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.interests.slice(start, end);
  }

  totalPages() {
    return Math.ceil(this.interests.length / this.itemsPerPage);
  }

  pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
}