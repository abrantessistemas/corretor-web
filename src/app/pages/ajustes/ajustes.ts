import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRippleModule
  ],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AjustesComponent {
  // Estado Reativo usando Signals
  currentPrimary = signal('#3f51b5');
  isDarkMode = signal(false);
  density = signal('comfortable');

  // Opções de Cores (Paleta Curada)
  primaryColors = signal([
    { name: 'Oceano', hex: '#3f51b5' },
    { name: 'Ametista', hex: '#673ab7' },
    { name: 'Céu', hex: '#2196f3' },
    { name: 'Floresta', hex: '#009688' },
    { name: 'Abóbora', hex: '#ff9800' },
    { name: 'Cereja', hex: '#e91e63' }
  ]);

  /**
   * Aplica a cor tema alterando a variável CSS global
   * @param hex Código hexadecimal da cor
   */
  setThemeColor(hex: string): void {
    this.currentPrimary.set(hex);
    document.documentElement.style.setProperty('--primary-color', hex);
  }

  /**
   * Alterna modo dark no body da aplicação
   */
  toggleDark(): void {
    this.isDarkMode.update(v => !v);
    document.body.classList.toggle('dark-theme', this.isDarkMode());
  }

  /**
   * Restaura as configurações para os valores de fábrica
   */
  resetSettings(): void {
    this.setThemeColor('#3f51b5');
    this.isDarkMode.set(false);
    this.density.set('comfortable');
    document.body.classList.remove('dark-theme');
  }
}