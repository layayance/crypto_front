import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsStore } from '../core/state/stats.store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './stats.html',
  styleUrls: ['./stats.scss']
})
export class StatsComponent implements OnInit {
  summaryColumns: string[] = ['symbol', 'name', 'quantity', 'invested', 'value', 'profitLoss', 'percentage'];
  distributionColumns: string[] = ['symbol', 'name', 'value', 'percentage'];
  historyColumns: string[] = ['date', 'action', 'symbol', 'quantity', 'price'];

  constructor(
    private snackBar: MatSnackBar,
    public store: StatsStore
  ) {}

  ngOnInit() {
    this.store.load();
  }

  loadStats() {
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

  getProfitLossClass(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'neutral';
    if (num > 0) return 'profit';
    if (num < 0) return 'loss';
    return 'neutral';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getActionColor(action?: string): 'primary' | 'accent' | 'warn' | undefined {
    if (!action) return 'primary';
    const actionLower = action.toLowerCase();
    if (actionLower.includes('supprim') || actionLower.includes('delete')) return 'warn';
    if (actionLower.includes('modif') || actionLower.includes('update')) return 'accent';
    return 'primary';
  }
}
