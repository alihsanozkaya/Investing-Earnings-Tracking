import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterestListComponent } from './components/interest-list/interest-list.component';
import { UserListComponent } from './components/user-list/user-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InterestListComponent, UserListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  
}
