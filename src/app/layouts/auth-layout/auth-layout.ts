import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';


@Component({
  standalone: true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet, MatCardModule],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss']
})
export class AuthLayoutComponent {}