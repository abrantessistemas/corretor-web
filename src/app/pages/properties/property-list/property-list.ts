import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

// Swiper Web Components Registration
import { register } from 'swiper/element/bundle';
import { PropertyService } from '../../../services/property';

register();

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    DialogModule
  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyListComponent {
  private readonly router = inject(Router);
  public readonly propertyService = inject(PropertyService);

  // Cache das configurações para evitar re-computações
  readonly setting = this.propertyService.settings();

  // Filtros em Signals leves
  readonly sortOrder = signal<'asc' | 'desc' | null>(null);
  readonly selectedZone = signal<string | null>(null);
  readonly selectedBairro = signal<string | null>(null);
  readonly selectedDormitorio = signal<number | null>(null);
  readonly selectedMetragem = signal<number | null>(null);

  loadDetails = false;
  readonly zonas = ['Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste', 'Centro'];

  // Listas derivadas dinamicamente com filtros seguros
  readonly bairros = computed(() => {
    const list = this.propertyService.properties() ?? [];
    const set = new Set<string>();
    for (let i = 0; i < list.length; i++) {
      const b = list[i].location?.bairro;
      if (b) set.add(b);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  readonly metragens = computed(() => {
    const list = this.propertyService.properties() ?? [];
    const set = new Set<number>();
    for (let i = 0; i < list.length; i++) {
      const area = list[i].specs?.area;
      if (Array.isArray(area)) {
        area.forEach(a => a && set.add(a));
      } else if (area) {
        set.add(area);
      }
    }
    return Array.from(set).sort((a, b) => a - b);
  });

  readonly dormitorios = computed(() => {
    const list = this.propertyService.properties() ?? [];
    const set = new Set<number>();
    for (let i = 0; i < list.length; i++) {
      const bed = list[i].specs?.bedrooms;
      if (bed) set.add(bed);
    }
    return Array.from(set).sort((a, b) => a - b);
  });

  private readonly urlSignal = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly isHome = computed(() => {
    const url = this.urlSignal();
    return url === '/' || url === '/home';
  });

  // Signal para controlar a lista de IDs favoritados (iniciando com o localStorage)
  readonly favoriteIds = signal<number[]>(this.getInitialFavorites());

  // Helper para carregar os favoritos iniciais com segurança
  private getInitialFavorites(): number[] {
    try {
      const saved = localStorage.getItem('favoriteProperties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  readonly filteredAndSortedProperties = computed(() => {
    const rawList = this.propertyService.properties() ?? [];
    const zone = this.selectedZone();
    const order = this.sortOrder();
    const bairro = this.selectedBairro();
    const area = this.selectedMetragem();
    const dormitorios = this.selectedDormitorio();

    let list = rawList.filter(item => {
      if (zone && item.location?.regiao !== zone) return false;
      if (bairro && item.location?.bairro !== bairro) return false;
      if (dormitorios && item.specs?.bedrooms !== dormitorios) return false;
      if (area) {
        const itemArea = item.specs?.area;
        if (Array.isArray(itemArea)) {
          if (!itemArea.includes(area)) return false;
        } else if (itemArea !== area) {
          return false;
        }
      }
      return true;
    });

    if (order) {
      list = [...list].sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return list;
  });

  // Helper para verificar o favorito
  isFavorite(propertyId: number): boolean {
    return this.favoriteIds().includes(propertyId);
  }

  // Alterna o estado de favoritar
  onToggleFavorite(event: Event, item: any): void {
    event.stopPropagation();
    const currentFavs = this.favoriteIds();
    const isFav = currentFavs.includes(item.id);

    let updatedFavs: number[];
    if (isFav) {
      updatedFavs = currentFavs.filter(id => id !== item.id);
    } else {
      updatedFavs = [...currentFavs, item.id];
    }

    this.favoriteIds.set(updatedFavs);

    try {
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavs));
    } catch (e) {
      console.error('Erro ao salvar favoritos no localStorage:', e);
    }
  }

  // Propriedades do WhatsApp calculadas dinamicamente
  readonly whatsappUrl = computed(() => {
    const config = this.setting?.whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const msg = config?.whatsappMessage || 'Olá! Gostaria de obter mais informações';
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  });

  toggleSort(): void {
    this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc');
  }

  filterByZone(zone: string): void {
    this.selectedZone.update(current => current === zone ? null : zone);
  }

  irParaCadastro(): void {
    this.router.navigate(['/imoveis/novo']);
  }

  verDetalhes(id: number): void {
    this.loadDetails = true;
    this.router.navigate(['/imoveis', id]);
  }

  registrarInteresse(title: string): void {
    const config = this.setting?.whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const message = `Olá, gostaria de mais detalhes sobre o projeto: ${title}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openWhatspp(): void {
    window.open(this.whatsappUrl(), '_blank', 'noopener,noreferrer');
  }
}