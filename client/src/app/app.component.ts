import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'מנהל פרויקטי וידאו';
  
  menuItems = [
    { path: '/dashboard', label: 'דשבורד', icon: 'dashboard' },
    { path: '/leads', label: 'Leads', icon: 'person_search' },
    { path: '/customers', label: 'לקוחות', icon: 'people' },
    { path: '/suppliers', label: 'ספקים', icon: 'business' },
    { path: '/projects', label: 'פרויקטים', icon: 'video_library' }
  ];
}
