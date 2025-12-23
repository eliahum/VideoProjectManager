import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'מנהל פרויקטי וידאו';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  
  menuItems = [
    { path: '/dashboard', label: 'דשבורד', icon: 'dashboard', children: [
      { path: '/dashboard/charts', label: 'גרפים', icon: 'bar_chart' },
      { path: '/dashboard/misc', label: 'שונות', icon: 'settings' }
    ]},
    { path: '/leads', label: 'Leads', icon: 'person_search' },
    { path: '/customers', label: 'לקוחות', icon: 'people' },
    { path: '/suppliers', label: 'ספקים', icon: 'business' },
    { path: '/projects', label: 'פרויקטים', icon: 'video_library' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggleMenu(): void {
    this.sidenav.toggle();
  }

  closeMenuIfMobile(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}
