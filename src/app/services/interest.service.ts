import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interest } from '../models/Interest';
import { AddInterestDto } from '../dtos/add-interest-dto';
import { UpdateInterestDto } from '../dtos/update-interest-dto';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  private apiUrl = `${environment.apiUrl}/Interest`;

  constructor(private httpClient: HttpClient) {}

  getAllInterest(): Observable<Interest[]> {
    return this.httpClient.get<Interest[]>(this.apiUrl + '/GetAllInterest');
  }

  getByIdInterest(id: number): Observable<Interest> {
    return this.httpClient.get<Interest>(this.apiUrl + '/GetByIdInterest/' + id);
  }

  getInterestsByUserIdAsync(userId: number): Observable<Interest[]> {
    return this.httpClient.get<Interest[]>(`${this.apiUrl}/GetInterestsByUserId?userId=${userId}`);
  }

  addInterest(addInterestDto: AddInterestDto): Observable<AddInterestDto> {
    return this.httpClient.post<AddInterestDto>(this.apiUrl + '/AddInterest', addInterestDto);
  }

  updateInterest(updateInterestDto: UpdateInterestDto): Observable<UpdateInterestDto> {
    return this.httpClient.put<UpdateInterestDto>(this.apiUrl + '/UpdateInterest', updateInterestDto);
  }

  deleteInterest(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.apiUrl}/DeleteInterest?id=${id}`);
  }
}