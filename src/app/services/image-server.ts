import { Injectable, signal } from '@angular/core';

export interface SliderImage {
  id: number;
  url: string; // Aqui guardaremos a string Base64 ou URL local
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly STORAGE_KEY = 'minha_galeria_fotos';

  // Signal para manter a lista sincronizada e performática
  images = signal<SliderImage[]>(this.loadFromLocalStorage());

  private loadFromLocalStorage(): SliderImage[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Simula o INSERT no banco
  async saveImage(file: File): Promise<void> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImg: SliderImage = {
          id: Date.now(),
          url: e.target?.result as string,
          name: file.name
        };

        const updated = [...this.images(), newImg];
        this.images.set(updated);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        resolve();
      };
      reader.readAsDataURL(file); // Converte imagem para string (Base64)
    });
  }

  // Simula o DELETE no banco
  deleteImage(id: number) {
    const updated = this.images().filter(img => img.id !== id);
    this.images.set(updated);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
}