import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, Asset } from '../../core/services/api.service';
import { InvalidationService } from '../../core/state/invalidation.service';

@Component({
  selector: 'app-asset-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './asset-dialog.html',
  styleUrls: ['./asset-dialog.scss']
})
export class AssetDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { asset: Asset | null },
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private invalidation: InvalidationService
  ) {
    this.isEdit = !!data.asset;
  }

  ngOnInit() {
    const asset = this.data.asset;
    
    this.form = this.fb.group({
      symbol: [asset?.symbol || '', [Validators.required]],
      name: [asset?.name || '', [Validators.required]],
      quantity: [asset?.quantity || '', [Validators.required, Validators.min(0)]],
      purchasePrice: [asset?.purchasePrice || '', [Validators.required, Validators.min(0)]],
      purchaseDate: [asset?.purchaseDate ? new Date(asset.purchaseDate) : new Date()]
    });
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      const formValue = this.form.value;
      
      const assetData: Asset = {
        symbol: formValue.symbol.toUpperCase(),
        name: formValue.name,
        quantity: formValue.quantity.toString(),
        purchasePrice: formValue.purchasePrice.toString(),
        purchaseDate: formValue.purchaseDate ? new Date(formValue.purchaseDate).toISOString().slice(0, 19).replace('T', ' ') : undefined
      };

      if (this.isEdit && this.data.asset?.id) {
        this.apiService.updateAsset(this.data.asset.id, assetData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('✅ Actif modifié avec succès', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.invalidation.invalidate(['portfolio', 'stats', 'dashboard']);
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(`❌ ${error.message || 'Erreur lors de la modification'}`, 'Fermer', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        this.apiService.addAsset(assetData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open(`✅ ${assetData.symbol} ajouté avec succès`, 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.invalidation.invalidate(['portfolio', 'stats', 'dashboard']);
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open(`❌ ${error.message || 'Erreur lors de l\'ajout'}`, 'Fermer', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
