import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class RegisterComponent {
  form;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      const email = this.form.value.email as string;
      const password = this.form.value.password as string;
      
      this.authService.register(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'Fermer', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(`❌ ${error.message || 'Erreur lors de l\'inscription'}`, 'Fermer', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
