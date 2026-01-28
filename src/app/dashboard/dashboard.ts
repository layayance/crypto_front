import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStore } from '../core/state/dashboard.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssetDialogComponent } from '../portfolio/asset-dialog/asset-dialog';
import { InvalidationService } from '../core/state/invalidation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public store: DashboardStore,
    private invalidation: InvalidationService
  ) {}

  ngOnInit() {
    this.store.load();
  }

  loadDashboard() {
    // backward compatible alias
    this.store.refresh();
  }

  formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatPercentage(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  }

  getProfitLossClass(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return 'neutral';
    return num >= 0 ? 'positive' : 'negative';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Today';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  getCryptoLogo(symbol: string): string {
    const logos: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'SOL': '◎',
      'ADA': '₳',
      'USDT': '₮',
      'BNB': 'BNB',
      'XRP': '✕',
      'DOGE': 'Ð'
    };
    return logos[symbol.toUpperCase()] || symbol.substring(0, 1);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AssetDialogComponent, {
      width: '500px',
      data: { asset: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invalidation.invalidate(['dashboard', 'portfolio', 'stats']);
        this.store.refresh();
      }
    });
  }
}
