import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject, computed, inject, input, signal, CUSTOM_ELEMENTS_SCHEMA, effect } from '@angular/core';
import { Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// Swiper Registration
import { register } from 'swiper/element/bundle';

// Services & Interfaces
import { Implantacao, Planta, Property, PropertyService } from '../../../services/property';

// Registrar Swiper Web Components
register();

@Component({
  selector: 'app-property-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './property-details.html',
  styleUrl: './property-details.scss'
})
export class PropertyDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  // Router Input Signal
  readonly id = input<string>();

  // Configurações Globais
  readonly setting = this.propertyService.settings();

  // Estados Reativos
  readonly property = signal<Property | null>(null);
  readonly selectedPlanta = signal<Planta | null>(null);
  readonly selectedImplantacao = signal<Implantacao | null>(null);

  constructor() {
    // Sincroniza o parâmetro id da rota dinamicamente
    effect(() => {
      const propertyId = Number(this.id());
      if (!propertyId) {
        this.voltar();
        return;
      }

      const found = this.propertyService.getPropertyById(propertyId);
      if (!found) {
        this.voltar();
        return;
      }

      this.property.set(found);

      if (found.planta?.length) {
        this.selectedPlanta.set(found.planta[0]);
      } else {
        this.selectedPlanta.set(null);
      }

      if (found.imagesUrl?.length) {
        this.selectedImplantacao.set(found.imagesUrl[0]);
      } else {
        this.selectedImplantacao.set(null);
      }
    });
  }

  // Computeds para URLs das Imagens
  readonly currentImageUrl = computed(() => {
    return this.selectedPlanta()?.imagesUrl ?? this.property()?.imagesUrl?.[0]?.imagesUrl ?? '';
  });

  readonly currentImageUrl2 = computed(() => {
    return this.selectedImplantacao()?.imagesUrl ?? this.property()?.imagesUrl?.[0]?.imagesUrl ?? '';
  });

  readonly currentImageUrlLogo = computed(() => {
    return this.property()?.idealization?.imagesUrl ?? '';
  });

  // Computed Dinâmico do WhatsApp
  readonly whatsappUrl = computed(() => {
    const config = this.setting?.whatsappConfig;
    const number = config?.whatsappNumber || '';
    const title = this.property()?.title || '';
    const planta = this.selectedPlanta();
    const areaInfo = planta?.specs?.area ? `, de ${planta.specs.area}m²` : '';
    const plantaDesc = planta?.description ? ` ${planta.description}` : '';

    const message = title
      ? `Olá! Gostaria de mais detalhes sobre o imóvel ${title}${plantaDesc}${areaInfo}`
      : this.setting?.siteTitle || 'Olá! Gostaria de mais detalhes sobre este imóvel';

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  });

  selectPlanta(planta: Planta): void {
    this.selectedPlanta.set(planta);
  }

  selectImplantacao(implantacao: Implantacao): void {
    this.selectedImplantacao.set(implantacao);
  }

  voltar(): void {
    this.router.navigate(['/imoveis']);
  }

  openImage(): void {
    this.openImageModal(this.currentImageUrl());
  }

  openImage2(): void {
    this.openImageModal(this.currentImageUrl2());
  }

  private openImageModal(imageUrl: string): void {
    if (!imageUrl) return;

    this.dialog.open(ImageDialogComponent, {
      data: { url: imageUrl },
      panelClass: 'full-screen-dialog',
      maxHeight: '100vh',
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });
  }

  irParaNegociacao(): void {
    this.router.navigate(['/imoveis/select', this.id()]);
  }
}

/**
 * Componente do Dialog de Imagem Expandida
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container" mat-dialog-close aria-label="Fechar visualização">
      <img [src]="data.url" alt="Imagem expandida em tela cheia" decoding="async">
      <button mat-flat-button class="close-float-btn">FECHAR</button>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.92);
      width: 100vw;
      height: 100vh;
      cursor: zoom-out;
      position: relative;
    }

    img {
      max-width: 90vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    }

    .close-float-btn {
      margin-top: 1.25rem;
      border-radius: 20px;
      font-weight: 700;
    }
  `]
})
export class ImageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: { url: string }) { }
}