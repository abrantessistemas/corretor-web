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
      panelClass: 'custom-dialog-container'
    });
  }

}

@Component({
  selector: 'image-detail-dialog',
  standalone: true,
  template: `<img [src]="data.url" style="width: 100%; height: 80%; border-radius: 8px;">`,
  imports: [MatDialogModule],
})
export class ImageDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) { }
}