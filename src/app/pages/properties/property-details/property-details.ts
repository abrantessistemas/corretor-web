import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

// Service e Interfaces
import { Implantacao, Planta, Property, PropertyService } from '../../../services/property';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './property-details.html',
  styleUrl: './property-details.scss'
})
export class PropertyDetailsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  setting = this.propertyService.settings();

  // Input vindo da rota
  @Input() id?: string;
  private found = this.propertyService.getPropertyById(Number(this.id));

  // Signals de Estado
  readonly property = signal<Property | null>(null);
  readonly selectedPlanta = signal<Planta | null>(null);
  readonly selectedImplantacao = signal<Implantacao | null>(null);

  whatappNumber = this.propertyService.settings().whatsappConfig.whatsappNumber || '';
  whatsappMensagem = this.propertyService.settings().siteTitle || 'Olá! Gostaria de mais detalhes sobre este imóvel';
  whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;


  // Computed para facilitar o acesso à imagem atual
  readonly currentImageUrl = computed(() => {
    const p = this.selectedPlanta();
    if (p) return p.imagesUrl;
    return this.property()?.imagesUrl[0] || '';
  });

  // Computed para facilitar o acesso à imagem atual
  readonly currentImageUrl2 = computed(() => {
    const p = this.selectedImplantacao();
    if (p) return p.imagesUrl;
    return this.property()?.imagesUrl[0] || '';
  });

  // Computed para facilitar o acesso à imagem logo
  readonly currentImageUrlLogo = computed(() => {
    const i = this.property()?.idealization;
    if (i) return i.imagesUrl;
    return '';
  });

  ngOnInit() {
    if (this.id) {
      this.found = this.propertyService.getPropertyById(Number(this.id));

      if (this.found) {
        this.property.set(this.found);
        // Inicializa com a primeira planta se disponível
        if (this.found.planta && this.found.planta.length > 0) {
          this.selectedPlanta.set(this.found.planta[0]);
        }
        // Inicializa com a primeira implantacao se disponível
        if (this.found.imagesUrl && this.found.imagesUrl.length > 0) {
          this.selectedImplantacao.set(this.found.imagesUrl[0]);
        }
        this.whatsappMensagem = `Olá! Gostaria de mais detalhes sobre o imóvel 
        ${this.found.title} ${this.selectedPlanta()?.description || ''}, de ${this.selectedPlanta()?.specs.area}m²`;

        this.whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;

      } else {
        this.router.navigate(['/imoveis']);
      }
    }
  }

  /**
   * Altera a planta selecionada e atualiza todos os dados da tela
   */
  selectPlanta(planta: Planta) {
    const projeto = this.propertyService.getPropertyById(Number(this.id));
    this.selectedPlanta.set(planta);
    this.whatsappMensagem = `Olá! Gostaria de mais detalhes sobre o imóvel 
        ${projeto?.title} ${planta?.description || ''}, de ${planta?.specs.area}m²`;
    this.whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;

  }

  /**
   * Altera a implantacao selecionada e atualiza todos os dados da tela
   */
  selectImplantacao(implantacao: Implantacao) {
    this.selectedImplantacao.set(implantacao);
  }

  voltar() {
    this.router.navigate(['/imoveis']);
  }

  openImage(): void {
    this.dialog.open(ImageDialogComponent, {
      data: { url: this.currentImageUrl() },
      panelClass: 'full-screen-dialog',
      maxHeight: '100vh',
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });
  }

  openImage2(): void {
    this.dialog.open(ImageDialogComponent, {
      data: { url: this.currentImageUrl2() },
      panelClass: 'full-screen-dialog',
      maxHeight: '100vh',
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });
  }

  irParaNegociacao(): void {
    this.router.navigate(['/imoveis/select/' + this.id]);
  }
}

/**
 * Componente interno para o Dialog de imagem expandida
 */
@Component({
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <div class="dialog-container" mat-dialog-close>
      <img [src]="data.url" alt="Imagem expandida">
      <button class="close-float-btn">FECHAR</button>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.95);
      width: 100vw;
      height: 100vh;
      cursor: zoom-out;
      position: relative;
    }
    img {
      max-width: 90%;
      max-height: 85%;
      object-fit: contain;
      box-shadow: 0 10px 50px rgba(0,0,0,0.8);
      border-radius: 4px;
    }
    .close-float-btn {
      margin-top: 20px;
      background: white;
      border: none;
      padding: 10px 20px;
      border-radius: 30px;
      font-weight: bold;
      cursor: pointer;
    }
  `]
})
export class ImageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) { }
}