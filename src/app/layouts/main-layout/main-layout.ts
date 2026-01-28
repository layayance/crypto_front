import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}