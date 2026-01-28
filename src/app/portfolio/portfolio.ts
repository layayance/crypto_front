import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Asset } from '../core/services/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetDialogComponent } from './asset-dialog/asset-dialog';
import { finalize } from 'rxjs/operators';
import { PortfolioStore } from '../core/state/portfolio.store';
import { InvalidationService } from '../core/state/invalidation.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss']
})
export class PortfolioComponent implements OnInit {
  displayedColumns: string[] = ['symbol', 'name', 'quantity', 'purchasePrice', 'purchaseDate', 'actions'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public store: PortfolioStore,
    private invalidation: InvalidationService
  ) {}

  ngOnInit() {
    this.store.load();
  }

  loadPortfolio() {
    // backward compatible alias
    this.store.refresh();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '500px',
      data: { asset: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.refresh();
      }
    });
  }

  openEditDialog(asset: Asset) {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '500px',
      data: { asset }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.refresh();
      }
    });
  }

  deleteAsset(asset: Asset) {
    if (!asset.id) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${asset.symbol} (${asset.name}) ?`)) {
      this.store.loading.set(true);
      this.apiService.deleteAsset(asset.id).pipe(
        finalize(() => {
          this.store.loading.set(false);
        })
      ).subscribe({
        next: () => {
          this.snackBar.open(`✅ ${asset.symbol} supprimé avec succès`, 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.invalidation.invalidate(['portfolio', 'stats', 'dashboard']);
          this.store.refresh();
        },
        error: (error) => {
          this.snackBar.open(`❌ ${error.message || 'Erreur lors de la suppression'}`, 'Fermer', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  formatPrice(price: string): string {
    return parseFloat(price).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
