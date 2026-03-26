import { Injectable, signal } from '@angular/core';

/**
 * Interface que define a estrutura de um Imóvel
 */
export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: 'Lançamento' | '100% Vendido';
  status: 'Pronto' | 'Lançamento' | 'Em obras';
  category: string;
  bedrooms: any;
  bathrooms: number;
  area: string;
  imageUrl: string;
  isPromo?: boolean; // <-- Nova propriedade opcional
  favorite: boolean;
}

@Injectable({
  providedIn: 'root' // Isso torna o serviço disponível em toda a aplicação
})
export class PropertyService {
  /**
   * Lista de imóveis mockados usando Signals (Angular 21)
   */
  private propertiesList = signal<Property[]>([
    {
      id: 1,
      title: 'Equale Condomínio Clube',
      price: 340000,
      location: 'Socorro São Paulo, SP',
      type: 'Lançamento',
      status: 'Lançamento',
      category: 'HIS-2',
      bedrooms: 2,
      bathrooms: 1,
      area: '34m² até 35m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2025/05/Perspectiva-Fachada-SignatureBarraFundaResidence.jpg.webp?w=500',
      isPromo: true,
      favorite: true
    }
    ,
    {
      id: 2,
      title: 'Pátio Central Galeria',
      price: 450000,
      location: 'Cambuci São Paulo SP',
      type: 'Lançamento',
      status: 'Em obras',
      category: 'R2V',
      bedrooms: 2,
      bathrooms: 1,
      area: '36m² até 44m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2025/02/Perspectiva-Fachada-PatioCentralGaleria.jpg.webp?w=500',
      isPromo: true,
      favorite: true
    }
    ,
    {
      id: 3,
      title: 'Do It Quatá',
      price: 383363,
      location: 'Vila Olímpia São Paulo/SP',
      type: '100% Vendido',
      status: 'Pronto',
      category: 'R2V',
      bedrooms: 1,
      bathrooms: 1,
      area: '24m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2023/03/Portaria-Do-it-quata-Riva.jpg.webp?w=500',
      isPromo: false,
      favorite: false
    }
    ,
    {
      id: 4,
      title: 'Brooklin Sky Home Tower',
      price: 383686,
      location: 'Brooklin São Paulo/SP',
      type: 'Lançamento',
      status: 'Lançamento',
      category: 'HIS-2 R2V',
      bedrooms: 1,
      bathrooms: 1,
      area: '26m² até 58m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2025/08/ABYTA_PRINCESA_ISABEL_FACHADA_HR.jpg.webp?w=500',
      isPromo: false,
      favorite: false
    }
    ,
    {
      id: 5,
      title: 'Abytá Santo Amaro',
      price: 125000,
      location: 'Santo Amaro São Paulo/SP',
      type: 'Lançamento',
      status: 'Lançamento',
      category: 'HIS-2 R2V',
      bedrooms: 2,
      bathrooms: 1,
      area: '34m² até 35m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2025/09/fachada-abyta.jpg.webp?w=500',
      isPromo: false,
      favorite: false
    }
    ,
    {
      id: 6,
      title: 'Signature Barra Funda',
      price: 450000,
      location: 'Barra Funda São Paulo/SP',
      type: 'Lançamento',
      status: 'Lançamento',
      category: 'R2V',
      bedrooms: [2, 3],
      bathrooms: 1,
      area: '46.36m² até 58.49m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2025/05/Perspectiva-Fachada-SignatureBarraFundaResidence.jpg.webp?w=500',
      isPromo: false,
      favorite: false
    }
    ,
    {
      id: 7,
      title: '011 Brooklin',
      price: 450000,
      location: 'Brooklin São Paulo/SP',
      type: 'Lançamento',
      status: 'Em obras',
      category: 'HIS-2 R2V',
      bedrooms: 1,
      bathrooms: 1,
      area: '41m² até 65m²',
      imageUrl: 'https://www.rivaincorporadora.com.br/wp-content/uploads/2025/06/Fachada_011-Brooklin-2.jpg.webp?w=500',
      isPromo: false,
      favorite: false
    }
  ]);

  // Expõe a lista como um sinal de apenas leitura para os componentes
  properties = this.propertiesList.asReadonly();

  constructor() { }

  /**
   * Adiciona um novo imóvel à lista reativa
   */
  addProperty(property: Property) {
    this.propertiesList.update(props => [...props, property]);
  }
}