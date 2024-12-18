import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { AddUserDto } from '../../dtos/add-user-dto';
import { UpdateUserDto } from '../../dtos/update-user-dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModalComponent } from '../modals/add-user-modal/add-user-modal.component';
import { UpdateUserModalComponent } from '../modals/update-user-modal/update-user-modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  openAddUserModal() {
    const modalRef = this.modalService.open(AddUserModalComponent);

    modalRef.componentInstance.userAdded.subscribe((user: AddUserDto) => {
      this.addUser(user);
    });
  }

  addUser(user: AddUserDto) {
    this.userService.addUser(user).subscribe({
      next: (response) => {
        this.users.push(response);
      },
      error: (error) => {
        console.error('Error adding user', error);
      },
    });
  }

  openUpdateUserModal(user: UpdateUserDto) {
    const modalRef = this.modalService.open(UpdateUserModalComponent);
    modalRef.componentInstance.user = { ...user };

    modalRef.componentInstance.userUpdated.subscribe(
      (updatedUser: UpdateUserDto) => {
        this.updateUser(updatedUser);
      }
    );

    modalRef.componentInstance.userDeleted.subscribe((userId: number) => {
      this.deleteUser(userId);
    });
  }

  updateUser(user: UpdateUserDto) {
    this.userService.updateUser(user).subscribe({
      next: (response) => {
        const index = this.users.findIndex(u => u.id === response.id);
        if (index !== -1) {
          this.users[index] = response;
        }  
      },
      error: (error) => {
        console.error('Error updating user', error);
      },
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: (deletedId) => {
        this.users = this.users.filter(u => u.id !== deletedId);
      },
      error: (error) => {
        console.error('Error deleting user', error);
      },
    });
  }
}
