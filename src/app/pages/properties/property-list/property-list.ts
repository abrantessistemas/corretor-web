import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

// Swiper Registration
import { register } from 'swiper/element/bundle';
import { Property, PropertyService } from '../../../services/property';

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
    MatSelectModule
  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyListComponent {
  private readonly router = inject(Router);
  readonly propertyService = inject(PropertyService);

  readonly setting = this.propertyService.settings();

  // Signals de Filtro
  readonly sortOrder = signal<'asc' | 'desc' | null>(null);
  readonly selectedZone = signal<string | null>(null);
  readonly selectedBairro = signal<string | null>(null);
  readonly selectedDormitorio = signal<number | null>(null);
  readonly selectedMetragem = signal<number | null>(null);

  loadDetails = false;
  readonly zonas = ['Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste', 'Centro'];

  // Favoritos representados por um Set para buscas de O(1)
  readonly favoriteSet = signal<Set<number>>(this.loadInitialFavorites());

  private loadInitialFavorites(): Set<number> {
    try {
      const saved = localStorage.getItem('favoriteProperties');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  }

  // Listas Opções Derivadas Otimizadas
  readonly bairros = computed(() => {
    const list = this.propertyService.properties() ?? [];
    const set = new Set<string>();
    for (const item of list) {
      if (item.location?.bairro) set.add(item.location.bairro);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  readonly metragens = computed(() => {
    const list = this.propertyService.properties() ?? [];
    const set = new Set<number>();
    for (const item of list) {
      const area = item.specs?.area;
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
    for (const item of list) {
      if (item.specs?.bedrooms) set.add(item.specs.bedrooms);
    }
    return Array.from(set).sort((a, b) => a - b);
  });

  // Filtragem Reativa Dinâmica
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
      list = [...list].sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
    }

    return list;
  });

  readonly whatsappUrl = computed(() => {
    const config = this.setting?.whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const msg = config?.whatsappMessage || 'Olá! Gostaria de obter mais informações';
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  });

  onToggleFavorite(event: Event, propertyId: number): void {
    event.stopPropagation();
    this.favoriteSet.update(set => {
      const updated = new Set(set);
      if (updated.has(propertyId)) {
        updated.delete(propertyId);
      } else {
        updated.add(propertyId);
      }
      try {
        localStorage.setItem('favoriteProperties', JSON.stringify(Array.from(updated)));
      } catch (e) {
        console.error('Erro ao guardar favoritos:', e);
      }
      return updated;
    });
  }

  toggleSort(): void {
    this.sortOrder.update(current => (current === 'asc' ? 'desc' : 'asc'));
  }

  filterByZone(zone: string): void {
    this.selectedZone.update(current => (current === zone ? null : zone));
  }

  verDetalhes(id: number): void {
    this.loadDetails = true;
    this.router.navigate(['/imoveis', id]);
  }

  registrarInteresse(title: string): void {
    const config = this.setting?.whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const message = `Olá, gostaria de mais detalhes sobre o projeto: ${title}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }
}