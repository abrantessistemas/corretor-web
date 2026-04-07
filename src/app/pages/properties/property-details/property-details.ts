import { Component, inject, signal, Input, OnInit, Inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

// Service e Interfaces
import { Planta, Property, PropertyService } from '../../../services/property';

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

  // Input vindo da rota
  @Input() id?: string;

  // Signals de Estado
  readonly property = signal<Property | null>(null);
  readonly selectedPlanta = signal<Planta | null>(null);

  // Computed para facilitar o acesso à imagem atual
  readonly currentImageUrl = computed(() => {
    const p = this.selectedPlanta();
    if (p) return p.imagesUrl;
    return this.property()?.imagesUrl[0] || '';
  });

  ngOnInit() {
    if (this.id) {
      const found = this.propertyService.getPropertyById(Number(this.id));
      
      if (found) {
        this.property.set(found);
        // Inicializa com a primeira planta se disponível
        if (found.planta && found.planta.length > 0) {
          this.selectedPlanta.set(found.planta[0]);
        }
      } else {
        this.router.navigate(['/imoveis']);
      }
    }
  }

  /**
   * Altera a planta selecionada e atualiza todos os dados da tela
   */
  selectPlanta(planta: Planta) {
    this.selectedPlanta.set(planta);
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