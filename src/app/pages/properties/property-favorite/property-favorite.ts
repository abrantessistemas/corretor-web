import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PropertyService } from '../../../services/property';

@Component({
  selector: 'app-property-favorite',
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
    MatTooltipModule,
    MatProgressBarModule,
    DialogModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './property-favorite.html',
  styleUrl: './property-favorite.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyFavoriteComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public propertyService = inject(PropertyService);

  setting = this.propertyService.settings();

  loadDetails = false;

  // Carrossel de imagens
  imageIndexes = signal<{ [key: number]: number }>({});
  private autoplayIntervalId: any;

  private urlSignal = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  isHome = computed(() => this.urlSignal() === '/' || this.urlSignal() === '/home');
  // 1. Signal que armazena os IDs dos imóveis favoritados recuperados do localStorage
  favoriteIds = signal<number[]>(this.loadFavoriteIdsFromStorage());

  // 2. Computed que filtra a lista do propertyService mantendo apenas os imóveis favoritados
  listaFavoritos = computed(() => {
    const favorites = this.favoriteIds();
    const allProperties = this.propertyService.properties() || [];

    // Retorna apenas os imóveis cujo ID está na lista de favoritos
    return allProperties.filter(property => favorites.includes(property.id));
  });

  // Método utilitário para ler do localStorage com segurança
  private loadFavoriteIdsFromStorage(): number[] {
    try {
      const saved = localStorage.getItem('favoriteProperties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Garante que o atributo 'favorite' dos itens seja true se estiver gravado no storage
  private syncPropertiesFavoritesState(): void {
    const favorites = this.favoriteIds();
    const properties = this.propertyService.properties() || [];

    properties.forEach(item => {
      item.favorite = favorites.includes(item.id);
    });
  }

  // 3. Salva/Remove do localStorage e atualiza o Signal reativo
  saveFavorite(id: number, favorite: boolean): void {
    let currentFavorites = this.loadFavoriteIdsFromStorage();

    if (favorite) {
      if (!currentFavorites.includes(id)) {
        currentFavorites.push(id);
      }
    } else {
      currentFavorites = currentFavorites.filter(favId => favId !== id);
    }

    // Atualiza o localStorage
    localStorage.setItem('favoriteProperties', JSON.stringify(currentFavorites));

    // Atualiza o Signal para que a listaFavoritos e a UI reajam imediatamente
    this.favoriteIds.set(currentFavorites);
  }


  ngOnInit(): void {
    // Sincroniza a propriedade "favorite" em cada imóvel do serviço na inicialização
    this.syncPropertiesFavoritesState();
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

  whatappNumber = this.propertyService.settings().whatsappConfig.whatsappNumber || '';
  whatsappMensagem = this.propertyService.settings().whatsappConfig.whatsappMessage || 'Olá! Gostaria de obter mais informações';
  whatsappContactName = this.propertyService.settings().whatsappConfig.whatsappContactName || 'Contato';

  whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;


  openWhatspp() {
    window.open(this.whatsappUrl, '_blank');
  }
}