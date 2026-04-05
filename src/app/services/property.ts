import { Injectable, signal } from '@angular/core';

/**
 * Interface que define a estrutura de um Imóvel
 */
export interface Property {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  price_promo: number;
  location: string;
  description: string;
  date?: Date;
  specs: {
    bedrooms: number,
    bathrooms: number,
    suits: number,
    balcony: boolean,
    area: number[],
    garden: boolean,
    parking: number
  },
  features: string[],
  amenities: string[],
  type: 'Lançamento' | '100% Vendido';
  status: 'Pronto' | 'Lançamento' | 'Em obras';
  category: string[];
  imagesUrl: string[];
  imagesPlantsUrl: string[];
  isPromo?: boolean;
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
      title: 'Brooklin Sky Home Tower',
      subtitle: '',
      price: 383636,
      price_promo: 0,
      location: 'Rua Princesa Isabel, 400 - Brooklin SP',
      description: '',
      date: new Date('2029-08-31'),
      specs: {
        bedrooms: 1,
        bathrooms: 1,
        suits: 0,
        balcony: true,
        area: [26, 27, 28, 31, 36, 37, 45, 58],
        garden: true,
        parking: 0
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico'],
      amenities: ['Piscina com dack molhado', 'Salão de Festas', 'Churrasqueira', 'Coworking', 'Academia 24h', 'Lavanderia Coletiva', 'Pet Place', 'lavanderia 24h', 'Bicicletário', 'Gerador', 'Mini-Mercado'],
      type: 'Lançamento',
      status: 'Lançamento',
      category: ['HIS-2', 'R2V'],

      imagesUrl: ['https://lh3.googleusercontent.com/d/1lNaLTg6NkiDcJ-AabwYT4LD8RxaaDEsU=s1000'],
      imagesPlantsUrl: [
        '../../assets/sky-plantas/Brooklin Sky Planta 2.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 4.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 6.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 8.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 10.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 12.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 14.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 16.png',
        '../../assets/sky-plantas/Brooklin Sky Planta 18.png'
      ],
      isPromo: false,
      favorite: true
    },
    {
      id: 2,
      title: 'Abytá Santo Amaro',
      subtitle: '',
      price: 279000,
      price_promo: 245000,
      location: 'Rua Herbert Alfred Landsberg, 27 - Santo Amaro SP',
      description: '',
      date: new Date('2028-12-31'),
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        suits: 0,
        balcony: true,
        area: [35],
        garden: false,
        parking: 0
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Lançamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: ['https://lh3.googleusercontent.com/d/11bXyQRnVmVnx9lT-Clp7c-h7EQUSoDBA=s1000'],
      imagesPlantsUrl: [
        '../../assets/abyta-plantas/Abyta Santo Amaro 1.PNG',
        '../../assets/abyta-plantas/Abyta Santo Amaro 2.PNG',
        '../../assets/abyta-plantas/Abyta Santo Amaro 3.PNG'
      ],
      isPromo: true,
      favorite: false
    },
    {
      id: 3,
      title: '011 Brooklin Residence',
      subtitle: '',
      price: 574690,
      price_promo: 0,
      location: 'Rua Caetano José Batista, 149 - Brooklin - SP',
      description: '',
      date: new Date('2028-12-31'),
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        suits: 0,
        balcony: true,
        area: [40.66, 41.85, 65.67],
        garden: true,
        parking: 1
      },
      features: [
        'Infraestrutura para ar-condicionado nos dormitórios',
        'Tomada USB nos dormitórios',
        'Janela com persiana de enrolar integrada nos dormitórios',
        'Bancadas da cozinha e do banheiro entregues em granito',
        'Ponto para máquina de lava-louça',
        'Ponto grill',
        'Torneiras com arejador',
        'Ponto para ducha higiênica',
        'Infra para chuveiro a gás',
        'Possibilidade de integração nas unidades que possuem drywall'
      ],
      amenities: [
        'PORTARIA',
        'CLAUSURA',
        'DELIVERY',
        'ESTACIONAMENTO DESCOBERTO',
        'PREVISÃO PARA GERADOR',
        'BICICLETÁRIO TORRE 1',
        'WINE BAR',
        'SALA DE JOGOS',
        'BRINQUEDOTECA',
        'HALL TORRE 1',
        'MINIMERCADO',
        'SALÃO DE FESTAS',
        'SALÃO DE FESTAS INFANTIL',
        'PET CARE',
        'PET PLACE',
        'CHURRASQUEIRA',
        'QUADRA RECREATIVA',
        'QUADRA DE BEACH TENNIS',
        'PLAYGROUND',
        'ESPAÇO LAREIRA E RELAX',
        'REDÁRIO',
        'SOLÁRIO',
        'PISCINA INFANTIL',
        'PISCINA COM HIDROMASSAGEM',
        'BICICLETÁRIO TORRE 2',
        'SPORT BAR',
        'COWORKING',
        'HALL TORRE 2',
        'ESPAÇO GOURMET',
        'ACADEMIA MUSCULAÇÃO',
        'ACADEMIA AERÓBICO',
        'ACADEMIA EXTERNA',
        'ESPAÇO BELEZA',
        'SPA E SALA DE MASSAGEM',
        'PISTA DE CAMINHADA'
      ],
      type: 'Lançamento',
      status: 'Em obras',
      category: ['HIS-2'],
      imagesUrl: ['https://lh3.googleusercontent.com/d/19RMbpAtLn34a7IgNT9Un0RBlweKgw14t=s1000'],
      imagesPlantsUrl: [
        '../../assets/011brooklin-plantas/011 Brooklin Planta 1.jpg',
        '../../assets/011brooklin-plantas/011 Brooklin Planta 2.jpg',
        '../../assets/011brooklin-plantas/011 Brooklin Planta 3.jpg',
        '../../assets/011brooklin-plantas/011 Brooklin Planta 4.jpg',
        '../../assets/011brooklin-plantas/011 Brooklin Planta 5.jpg',
        '../../assets/011brooklin-plantas/011 Brooklin Planta 6.jpg',
      ],
      isPromo: false,
      favorite: false
    },
    {
      id: 4,
      title: 'Pátio Central',
      subtitle: '',
      price: 340090,
      price_promo: 0,
      location: 'Rua Junqueira Freire, no 263 - Liberdade - SP',
      description: '',
      date: new Date('2028-06-30'),
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        suits: 1,
        balcony: true,
        area: [36.77, 37.44, 38.81, 44.15, 44.24],
        garden: false,
        parking: 1
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: [
        'Salão de Festas',
        'Bicicletário',
        'Brinquedoteca',
        'Hall/Lounge',
        'Salão de Jogos',
        'Jogos Externo',
        'Fitness',
        'Fitness Externo',
        'Home Market',
        'Hall/Coworking',
        'Espaço Gourmet',
        'Gourmet Externo',
        'Piscinas Adulto, Infantil e Deck Molhado',
        'Solarium',
        'Churrasqueira',
        'Pomar',
        'Playground',
        'Praça da Leitura',
        'Beach Tennis com Arquibancada',
        'Pet Place',
        'Redário'
      ],
      type: 'Lançamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: ['../../assets/patio-plantas/patiofachada.jpeg'],
      imagesPlantsUrl: [
        '../../assets/patio-plantas/380.7_PLANTAS COM DIFERENCIAIS SEM TEXTO LEGAL_V14F.jpg',
        '../../assets/patio-plantas/380.7_PLANTAS COM DIFERENCIAIS SEM TEXTO LEGAL_V14F2.jpg',
        '../../assets/patio-plantas/380.7_PLANTAS COM DIFERENCIAIS SEM TEXTO LEGAL_V14F3.jpg',
        '../../assets/patio-plantas/380.7_PLANTAS COM DIFERENCIAIS SEM TEXTO LEGAL_V14F4.jpg',
        '../../assets/patio-plantas/380.7_PLANTAS COM DIFERENCIAIS SEM TEXTO LEGAL_V14F5.jpg',
        
      ],
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

  getPropertyById(id: number): Property | undefined {
    return this.propertiesList().find(p => p.id === id);
  }
}