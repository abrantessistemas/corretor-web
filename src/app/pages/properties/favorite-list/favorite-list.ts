import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PropertyService } from '../../../services/property';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteListComponent {
  private readonly router = inject(Router);
  public readonly propertyService = inject(PropertyService);

  readonly setting = this.propertyService.settings();
  loadDetails = false;

  // Signal sincronizado com o localStorage
  readonly favoriteIds = signal<number[]>(this.getInitialFavorites());

  private getInitialFavorites(): number[] {
    try {
      const saved = localStorage.getItem('favoriteProperties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Filtra apenas os imóveis favoritados a partir da lista geral do Service
  readonly favoriteProperties = computed(() => {
    const rawList = this.propertyService.properties() ?? [];
    const favs = new Set(this.favoriteIds());
    return rawList.filter(item => favs.has(item.id));
  });

  // URL do WhatsApp configurada no Service
  readonly whatsappUrl = computed(() => {
    const config = this.setting?.whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const msg = config?.whatsappMessage || 'Olá! Gostaria de obter mais informações';
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  });

  removerFavorito(event: Event, id: number): void {
    event.stopPropagation();
    const updatedFavs = this.favoriteIds().filter(favId => favId !== id);

    this.favoriteIds.set(updatedFavs);

    try {
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavs));
    } catch (e) {
      console.error('Erro ao atualizar localStorage:', e);
    }
  }

  verDetalhes(id: number): void {
    this.loadDetails = true;
    this.router.navigate(['/imoveis', id]);
  }

  registrarInteresse(title: string): void {
    const config = this.setting?.whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const message = `Olá, gostaria de mais detalhes sobre o projeto favoritado: ${title}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}