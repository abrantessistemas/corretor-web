import { Component, inject, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

// O caminho foi ajustado para garantir que o Angular encontre o serviço corretamente
// Certifique-se de que o arquivo existe em: src/app/services/property.service.ts
import { PropertyService } from '../../../services/property';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NavigationEnd, Router } from '@angular/router';
import { PropertySlide } from "../property-slide/property-slide";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe,
    PropertySlide,
    MatTooltipModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyListComponent implements OnInit {
  ngOnInit(): void {

    this.propertyService.properties().map(property => {
      if (property.specs.area.length > 1) {
        property.specs.area = [property.specs.area[0], property.specs.area[property.specs.area.length - 1]];
      }
    });
  }
  // Utilizando a injeção de dependências moderna do Angular
  private router = inject(Router);
  /**
   * Injeção do serviço de propriedades.
   * Usando o padrão de injeção do Angular 21.
   */
  public propertyService = inject(PropertyService);
  sortOrder = signal<'asc' | 'desc' | null>(null);
  sortedProperties = computed(() => {
    const list = [...this.propertyService.properties()]; // Copia a lista original
    const order = this.sortOrder();

    if (!order) return list;

    return list.sort((a, b) => {
      return order === 'asc'
        ? a.price - b.price
        : b.price - a.price;
    });
  });

  toggleSort() {
    // Alterna entre Ascendente, Descendente e Original (opcional)
    this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc');
  }

  /**
   * Navega para o formulário de cadastro de um novo imóvel.
   * Certifique-se de que a rota 'imoveis/novo' está configurada no app.routes.ts
   */
  irParaCadastro(): void {
    this.router.navigate(['/imoveis/novo']);
  }
  loadDetails = false;
  /**
   * Método para visualizar os detalhes de um imóvel específico.
   * @param id Identificador único do imóvel.
   */
  verDetalhes(id: number): void {
    this.loadDetails = true;
    this.router.navigate(['/imoveis/' + id])
  }

  /**
   * Método para registrar interesse em um imóvel.
   * @param title Título do imóvel para referência.
   */
  registrarInteresse(title: string): void {
    console.log('Interesse registrado para:', title);
    // Aqui poderíamos abrir um formulário de contato ou enviar um lead
  }
  saveFavorite(id: number, favorite: boolean): void {
    if (favorite) {
      localStorage.setItem('favoriteProperties', id.toString());
    }
  }

  // 1. Captura os eventos de navegação em um Signal
  private urlSignal = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  // 2. Computed que retorna true apenas se for a home
  isHome = computed(() => this.urlSignal() === '/' || this.urlSignal() === '/home');

  // Signal para armazenar a zona selecionada
selectedZone = signal<string | null>(null);

// Lista de zonas disponíveis (pode vir do serviço ou ser estática)
zonas = ['Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste', 'Centro'];

// Atualizamos o computed para filtrar E ordenar
filteredAndSortedProperties = computed(() => {
  let list = [...this.propertyService.properties()];
  const zone = this.selectedZone();
  const order = this.sortOrder();

  // 1. Filtrar por Zona
  if (zone) {
    list = list.filter(item => item.region === zone);
  }

  // 2. Ordenar por Valor
  if (order) {
    list.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
  }

  return list;
});

// Função para selecionar/deselecionar zona
filterByZone(zone: string) {
  this.selectedZone.update(current => current === zone ? null : zone);
}
}