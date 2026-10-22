import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PropertyService } from '../../services/property';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRippleModule,
    NgxMaskDirective
  ],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.scss',
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AjustesComponent implements OnInit {
  config = inject(PropertyService);

  // Variáveis vinculadas ao formulário
  tempTitle = this.config.settings().siteTitle;
  tempLogo = this.config.settings().logo[0]?.imagesUrl || '';
  whatsappNumber = this.config.settings().whatsappConfig.whatsappNumber || '';

  savedSuccess = false;
  showToast = false;

  currentPrimary = signal('#026d14');
  isDarkMode = signal(false);
  density = signal('comfortable');

  // Opções de Cores (Paleta Curada)
  primaryColors = signal([
    { name: 'Oceano', hex: '#3f51b5' },
    { name: 'Ametista', hex: '#673ab7' },
    { name: 'Céu', hex: '#2196f3' },
    { name: 'Floresta', hex: '#009688' },
    { name: 'Abóbora', hex: '#ff9800' },
    { name: 'Cereja', hex: '#e91e63' },
    { name: 'Abacaxi', hex: '#dce91e' },
    { name: 'Oliva', hex: '#026d14' },
    { name: 'Chiclete', hex: '#e91eb6' },
    { name: 'Chocolate', hex: '#6b5e57' },
    { name: 'Tomate', hex: '#db0808' },
    { name: 'Negro', hex: '#000000' }
  ]);

  private readonly STORAGE_THEME_KEY = 'app_theme_settings';

  ngOnInit(): void {
    this.carregarConfiguracoesLocalStorage();
  }

  /**
   * Aplica a cor tema alterando a variável CSS global e salvando no LocalStorage
   * @param hex Código hexadecimal da cor
   */
  setThemeColor(hex: string): void {
    this.currentPrimary.set(hex);
    document.documentElement.style.setProperty('--primary-color', hex);
    document.documentElement.style.setProperty('--mat-sys-on-primary', `#000000`);
    this.salvarConfiguracoesLocalStorage();
  }

  /**
   * Alterna modo dark no body da aplicação e salva no LocalStorage
   */
  toggleDark(): void {
    this.isDarkMode.update(v => !v);
    document.body.classList.toggle('dark-theme', this.isDarkMode());
    this.salvarConfiguracoesLocalStorage();
  }

  /**
   * Restaura as configurações para os valores de fábrica e limpa o LocalStorage de temas
   */
  resetSettings(): void {
    this.setThemeColor('#026d14');
    this.isDarkMode.set(false);
    this.density.set('comfortable');
    document.body.classList.remove('dark-theme');
    localStorage.removeItem(this.STORAGE_THEME_KEY);
  }

  private salvarConfiguracoesLocalStorage(): void {
    const estadoTema = {
      primaryColor: this.currentPrimary(),
      isDarkMode: this.isDarkMode(),
      density: this.density()
    };
    try {
      localStorage.setItem(this.STORAGE_THEME_KEY, JSON.stringify(estadoTema));
    } catch (e) {
      console.error('Erro ao salvar tema no LocalStorage:', e);
    }
  }

  private carregarConfiguracoesLocalStorage(): void {
    const dadosSalvos = localStorage.getItem(this.STORAGE_THEME_KEY);
    if (!dadosSalvos) return;

    try {
      const estado = JSON.parse(dadosSalvos);
      
      if (estado.primaryColor) {
        this.currentPrimary.set(estado.primaryColor);
        document.documentElement.style.setProperty('--primary-color', estado.primaryColor);
      }
      
      if (estado.isDarkMode !== undefined) {
        this.isDarkMode.set(estado.isDarkMode);
        document.body.classList.toggle('dark-theme', estado.isDarkMode);
      }

      if (estado.density) {
        this.density.set(estado.density);
      }
    } catch (e) {
      console.error('Erro ao carregar tema do LocalStorage:', e);
    }
  }

  save() {
    this.config.updateSettings({
      siteTitle: this.tempTitle,
      logo: [{
        id: 1,
        imagesUrl: this.tempLogo,
        description: this.config.settings().logo[0]?.description || ''
      }]
    });
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  reset() {
    const current = this.config.settings();
    this.tempTitle = current.siteTitle;
    this.tempLogo = current.logo[0]?.imagesUrl || '';
  }

  onImgError(event: any) {
    event.target.src = 'https://placehold.co/200x100?text=Logo+Invalida';
  }
}