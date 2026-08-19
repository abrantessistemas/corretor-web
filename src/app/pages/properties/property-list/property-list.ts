import { Component, inject, ChangeDetectionStrategy, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { PropertyService } from '../../../services/property';

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
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { PropertyFilter } from '../property-filter/property-filter';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

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
    DialogModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInputModule,
    FormsModule

  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public propertyService = inject(PropertyService);
  setting = this.propertyService.settings();

  sortOrder = signal<'asc' | 'desc' | null>(null);
  loadDetails = false;
  selectedZone = signal<string | null>(null);
  selectedBairro = signal<string | null>(null);
  selectedDormitorio = signal<number | null>(null);
  selectedMetragem = signal<number | null>(null);
  zonas = ['Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste', 'Centro'];


  // Sinais para controlar os índices ativos de imagem por imóvel
  imageIndexes = signal<{ [key: number]: number }>({});
  private autoplayIntervalId: any;

  whatappNumber = this.propertyService.settings().whatsappConfig.whatsappNumber || '';
  whatsappMensagem = this.propertyService.settings().whatsappConfig.whatsappMessage || 'Olá! Gostaria de obter mais informações';
  whatsappContactName = this.propertyService.settings().whatsappConfig.whatsappContactName || 'Contato';

  whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;

  bairros: any = [];
  metragens: any = [];
  dormitorios: any = [];


  ngOnInit(): void {
    const propertiesList = this.propertyService.properties() || [];
    propertiesList.forEach(property => {
      if (property?.specs?.area && Array.isArray(property.specs.area) && property.specs.area.length > 1) {
        property.specs.area = [property.specs.area[0], property.specs.area[property.specs.area.length - 1]];
      }
    });
    this.bairros = propertiesList.map(property => property.location.bairro).filter((value, index, self) => self.indexOf(value) === index);
    this.bairros.sort((a: string, b: string) => a.localeCompare(b)); // Ordena alfabeticamente
    this.metragens = [
      ...new Set(
        propertiesList.flatMap(property => property.specs.area)
      )
    ].sort((a, b) => a - b); // .sort() é opcional, caso queira ordenar os números
    this.dormitorios = propertiesList.map(property => property.specs.bedrooms).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas
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
    }, 4000); // 4 segundos entre as trocas para acomodar a suavidade da animação
  }

  getActiveIndex(propertyId: number): number {
    return this.imageIndexes()[propertyId] || 0;
  }

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

    if (order) {
      list.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }

    if (bairro) {
      list = list.filter(item => item.location?.bairro === bairro);
    }

    if (area) {
      list = list.filter(item => item.specs.area.find(a => a === area));
    }
    if (dormitorios) {
      list = list.filter(item => item.specs.bedrooms === this.dormitorios);
    }
    return list;
  });

  toggleSort() {
    this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc');
  }

  irParaCadastro(): void {
    this.router.navigate(['/imoveis/novo']);
  }

  verDetalhes(id: number): void {
    this.loadDetails = true;
    this.router.navigate(['/imoveis/' + id]);
  }

  registrarInteresse(title: string): void {
    this.whatsappMensagem = `Olá eu gostaria de mais detalhes sobre o projeto: ${title}`;
    this.whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;
    window.open(this.whatsappUrl, '_blank');
  }

  saveFavorite(id: number, favorite: boolean): void {
    if (favorite) {
      localStorage.setItem('favoriteProperties', id.toString());
    }
  }

  private urlSignal = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  isHome = computed(() => this.urlSignal() === '/' || this.urlSignal() === '/home');

  filterByZone(zone: string) {
    this.selectedZone.update(current => current === zone ? null : zone);
  }

  dialog = inject(Dialog);

  openDialog() {
    this.dialog.open(PropertyFilter, {
      minWidth: '300px',
      data: {
        animal: 'panda',
      },
    });
  }

}

@Component({
  selector: 'cdk-dialog-data-example-dialog',
  template: `
    <div class="container" style="background-color: #f5f5f5; padding: 2rem; border-radius: 8px;">
      <h1>Meu Título</h1>
      <p>Este HTML está direto no arquivo .ts!</p>
    </div>
  `,
})
export class CdkDialogDataExampleDialog {
  // data = inject(DIALOG_DATA);
}