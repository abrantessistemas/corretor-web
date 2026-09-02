import { Component, inject, ChangeDetectionStrategy, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { PropertyService } from '../../../services/property';
import { PropertySlide } from '../property-slide/property-slide';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe,
    PropertySlide,
    MatTooltipModule,
    MatProgressBarModule,
    DialogModule,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public propertyService = inject(PropertyService);
  private dialog = inject(Dialog);

  setting = this.propertyService.settings();

  // Filtros em Signals
  sortOrder = signal<'asc' | 'desc' | null>(null);
  selectedZone = signal<string | null>(null);
  selectedBairro = signal<string | null>(null);
  selectedDormitorio = signal<number | null>(null);
  selectedMetragem = signal<number | null>(null);

  loadDetails = false;
  zonas = ['Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste', 'Centro'];

  // Carrossel de imagens
  imageIndexes = signal<{ [key: number]: number }>({});
  private autoplayIntervalId: any;

  // Listas derivadas dinamicamente
  bairros = computed(() => {
    const list = this.propertyService.properties() || [];
    return [...new Set(list.map(p => p.location?.bairro).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  });

  metragens = computed(() => {
    const list = this.propertyService.properties() || [];
    const areas = list.flatMap(p => Array.isArray(p.specs?.area) ? p.specs.area : [p.specs?.area]).filter(Boolean);
    return [...new Set(areas)].sort((a, b) => a - b);
  });

  dormitorios = computed(() => {
    const list = this.propertyService.properties() || [];
    const bedrooms = list.map(p => p.specs?.bedrooms).filter(Boolean);
    return [...new Set(bedrooms)].sort((a, b) => a - b);
  });

  private urlSignal = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  isHome = computed(() => this.urlSignal() === '/' || this.urlSignal() === '/home');

  filteredAndSortedProperties = computed(() => {
    let list = [...(this.propertyService.properties() || [])];
    const zone = this.selectedZone();
    const order = this.sortOrder();
    const bairro = this.selectedBairro();
    const area = this.selectedMetragem();
    const dormitorios = this.selectedDormitorio();

    if (zone) {
      list = list.filter(item => item.location?.regiao === zone);
    }

    if (bairro) {
      list = list.filter(item => item.location?.bairro === bairro);
    }

    if (area) {
      list = list.filter(item =>
        Array.isArray(item.specs?.area) ? item.specs.area.includes(area) : item.specs?.area === area
      );
    }

    if (dormitorios) {
      list = list.filter(item => item.specs?.bedrooms === dormitorios);
    }

    if (order) {
      list.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return list;
  });

  ngOnInit(): void {
    this.startImageAutoplay();
  }

  ngOnDestroy(): void {
    if (this.autoplayIntervalId) {
      clearInterval(this.autoplayIntervalId);
    }
  }

  private startImageAutoplay(): void {
    this.autoplayIntervalId = setInterval(() => {
      const currentProperties = this.propertyService.properties() || [];
      this.imageIndexes.update(indexes => {
        const updatedIndexes = { ...indexes };

        currentProperties.forEach(item => {
          const totalImages = item.imagesUrl?.length || 0;
          if (totalImages > 1) {
            const currentIndex = updatedIndexes[item.id] || 0;
            updatedIndexes[item.id] = (currentIndex + 1) % totalImages;
          } else {
            updatedIndexes[item.id] = 0;
          }
        });

        return updatedIndexes;
      });
    }, 4000);
  }

  getActiveIndex(propertyId: number): number {
    return this.imageIndexes()[propertyId] || 0;
  }

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
    const config = this.propertyService.settings().whatsappConfig;
    const phone = config?.whatsappNumber || '';
    const message = `Olá, gostaria de mais detalhes sobre o projeto: ${title}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
  saveFavorite(id: number, favorite: boolean): void {
    // 1. Obtém a lista atual de favoritos do localStorage
    const savedFavorites = localStorage.getItem('favoriteProperties');

    // 2. Converte para array de números (ou cria um array vazio se não existir)
    let favoritesList: number[] = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (favorite) {
      // 3. Adiciona o ID se ainda não estiver na lista
      if (!favoritesList.includes(id)) {
        favoritesList.push(id);
      }
    } else {
      // 4. Remove o ID se o usuário desmarcar o favorito
      favoritesList = favoritesList.filter(favId => favId !== id);
    }

    // 5. Salva a lista atualizada de volta no localStorage
    localStorage.setItem('favoriteProperties', JSON.stringify(favoritesList));
  }

  whatappNumber = this.propertyService.settings().whatsappConfig.whatsappNumber || '';
  whatsappMensagem = this.propertyService.settings().whatsappConfig.whatsappMessage || 'Olá! Gostaria de obter mais informações';
  whatsappContactName = this.propertyService.settings().whatsappConfig.whatsappContactName || 'Contato';

  whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;


  openWhatspp() {
    window.open(this.whatsappUrl, '_blank');
  }
}