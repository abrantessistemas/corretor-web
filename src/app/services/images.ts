import { Injectable, signal } from '@angular/core';

export interface SliderImage {
  id: number;
  url: string;
  name: string;
}

@Injectable({
  providedIn: 'root' // Isso torna o serviço disponível em toda a aplicação
})
export class ImagesService {
  /**
   * Lista de imóveis mockados usando Signals (Angular 21)
   */
  private slideImageList = signal<SliderImage[]>([
    {
      id: 1,
      url: '../../../../assets/Abytá Santo Amaro - 8.png',
      name: 'Abytá Santo Amaro'
    }
  ]);

  // Expõe a lista como um sinal de apenas leitura para os componentes
  slidesImages = this.slideImageList.asReadonly();

  constructor() { }

  /**
   * Adiciona um novo imóvel à lista reativa
   */
  addImageSlide(slideImage: SliderImage) {
    this.slideImageList.update(props => [...props, slideImage]);
  }
}