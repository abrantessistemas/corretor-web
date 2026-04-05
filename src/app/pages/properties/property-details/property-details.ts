import { Component, inject, signal, Input, OnInit, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { Property, PropertyService } from '../../../services/property';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule
  ],
  templateUrl: './property-details.html',
  styleUrl: './property-details.scss'
})
export class PropertyDetailsComponent implements OnInit {
  constructor(private dialog: MatDialog) { }

  private router = inject(Router);

  // Input vindo da rota (configurado no appConfig com withComponentInputBinding)
  @Input() id?: number;
  /**
     * Injeção do serviço de propriedades.
     * Usando o padrão de injeção do Angular 21.
     */
  public propertyService = inject(PropertyService);
  readonly property = signal<Property | null>(null);

  selectedImage = signal(this.property()?.imagesUrl[0]);

  ngOnInit() {
    if (this.id) {
      const found = this.propertyService.getPropertyById(Number(this.id));
      if (found) {
        this.property.set(found);
        this.changeImage(found.imagesPlantsUrl[0]);
      } else {
        this.router.navigate(['/imoveis']);
      }
    }
  }

  changeImage(url: string) {
    this.selectedImage.set(url);
  }

  voltar() {
    this.router.navigate(['/imoveis']);
  }

  openImage(): void {
    this.dialog.open(ImageDialogComponent, {
      data: { url: this.selectedImage() },
      panelClass: 'full-screen-dialog', // Classe para remover paddings do Material
      maxHeight: '100vh',
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });
  }
}

@Component({
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <div class="dialog-container" mat-dialog-close>
      <img [src]="data.url" alt="Imagem expandida">
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.9);
      width: 100vw;
      height: 100vh;
      cursor: zoom-out;
    }
    img {
      max-width: 95%;
      max-height: 95%;
      object-fit: contain; /* Garante que não corte na tela cheia */
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
  `]
})
export class ImageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) { }
}