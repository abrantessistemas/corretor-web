import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageService } from '../../../services/image-server';

@Component({
  selector: 'app-property-slide',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './property-slide.html',
  styleUrl: './property-slide.scss',
})
export class PropertySlide {
  @ViewChild('slider', { static: false }) slider!: ElementRef;
  // Injetando o serviço de banco simulado
  public db = inject(ImageService);
  private dialog = inject(MatDialog);

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      await this.db.saveImage(file);
      // Scroll automático para o final após adicionar
      setTimeout(() => this.moveRight(), 100);
    }
  }

  moveLeft() { this.slider.nativeElement.scrollLeft -= 350; }
  moveRight() { this.slider.nativeElement.scrollLeft += 350; }

  remove(id: number, event: Event) {
    event.stopPropagation(); // Impede de abrir o zoom ao clicar em excluir
    this.db.deleteImage(id);
  }

  images: string[] = [
    '../../../../assets/promo/Abytá Santo Amaro - 8.png',
    '../../../../assets/promo/BrooklinSky.png',
    '../../../../assets/promo/Holistic Residence.png',
    '../../../../assets/promo/patio.png',
    '../../../../assets/promo/Concept Barra Funda.png',
    '../../../../assets/promo/011Brooklin.jpeg',
    '../../../../assets/promo/Signature Barra Funda.png'
  ];

  constructor() { }

  openImage(imgUrl: string) {
    this.dialog.open(ImageDetailDialog, {
      data: { url: imgUrl },
      panelClass: 'full-screen-dialog',
      maxHeight: '100vh',
      maxWidth: '100vw',
      width: '100%',
      height: '85%'
    });
  }

}

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
      max-width: 100%;
      max-height: 90%;
      border-radius: 30px;
      object-fit: contain;
      box-shadow: 0 10px 50px rgba(0,0,0,0.8);
    }
    .close-float-btn {
      margin-top: 20px;
      background: white;
      border-radius: 30px;
      border: none;
      padding: 10px 20px;
      font-weight: bold;
      cursor: pointer;
    }
  `]
})
export class ImageDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) { }
}