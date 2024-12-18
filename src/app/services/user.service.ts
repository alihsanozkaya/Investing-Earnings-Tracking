import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUserDto } from '../dtos/add-user-dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl + '/GetAllUser');
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<any>(this.apiUrl + '/GetByIdUser/' + id);
  }

  addUser(addUserDto: AddUserDto): Observable<AddUserDto> {
    return this.httpClient.post<AddUserDto>(this.apiUrl + '/AddUser', addUserDto);
  }

  updateUser(updateUserDto: UpdateUserDto): Observable<UpdateUserDto> {
    return this.httpClient.put<UpdateUserDto>(this.apiUrl + '/UpdateUser', updateUserDto);
  }

  deleteUser(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.apiUrl}/DeleteUser?id=${id}`);
  }
}