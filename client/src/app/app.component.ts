import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

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
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'מנהל וידאו';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isProduction = environment.production;
  
  menuItems = [
    { path: '/dashboard', label: 'דשבורד', icon: 'dashboard', children: [
      { path: '/dashboard/charts', label: 'גרפים', icon: 'bar_chart' },
      { path: '/dashboard/misc', label: 'שונות', icon: 'settings' }
    ]},
    { path: '/leads', label: 'לידים', icon: 'person_search' },
    { path: '/customers', label: 'לקוחות', icon: 'people' },
    { path: '/suppliers', label: 'ספקים', icon: 'business' },
    { path: '/projects', label: 'פרויקטים', icon: 'video_library' },
    { path: '/tasks', label: 'משימות', icon: 'task' },
    { path: '/statuses', label: 'סטטוסים', icon: 'toggle_on', adminOnly: true },
    { path: '/backup', label: 'גיבויים', icon: 'backup', superadminOnly: true, children: [
      { path: '/backup', label: 'ניהול גיבויים', icon: 'cloud_upload' },
      { path: '/backup/restore', label: 'שחזור גיבוי', icon: 'restore' }
    ]}
  ];

  get filteredMenuItems() {
    return this.menuItems.filter(item => {
      if (item.superadminOnly) {
        const user = this.authService.getCurrentUser();
        return user?.role === 'superadmin';
      }
      if (item.adminOnly) {
        return this.authService.isAdmin();
      }
      return true;
    });
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private router: Router
  ) {
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
