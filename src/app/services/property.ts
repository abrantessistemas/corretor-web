import { Injectable, signal } from '@angular/core';
import { get } from 'node:http';

/**
 * Interface que define a estrutura de um Imóvel
 */
export interface Property {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  price: number;
  price_promo: number;
  towers: number;
  units_available: number;
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
  type: 'Estudio' | 'Apartamento' | 'Casa' | 'Cobertura';
  status: 'Pronto' | 'Lançamento' | 'Em obras' | '100% Vendido';
  category: string[];
  imagesUrl: string[];
  planta: Planta[];
  isPromo?: boolean;
  favorite: boolean;
}

export interface Planta {
  id: number;
  description: string;
  location: {
    towers: any[],
    floor: number[]
  };
  price: number;
  price_promo: number;
  specs: {
    bedrooms: number,
    bathrooms?: number,
    suits?: number,
    balcony?: boolean,
    area: number[],
    garden?: boolean,
    parking?: number
  },
  features: string[],
  status: 'Disponivel' | 'Espelho' | 'Reservada' | 'Vendida' | 'Bloqueada',
  imagesUrl: string,
  category: 'HIS-1' | 'HIS-2' | 'R2V' | 'HMP'
}

export interface Incorporador {
  id: number;
  imagesUrl: string,
  title: string;
  description: string;
  location: string;
  date?: Date;
  site: string;
}

/**
 * Interface para as definições globais do site
 */
export interface AppSettings {
  siteTitle: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
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
      description: '',
      location: 'Rua Princesa Isabel, 400 - Brooklin SP',
      price: 383636,
      price_promo: 0,
      towers: 1,
      units_available: 370,
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
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2', 'R2V'],

      imagesUrl: ['https://lh3.googleusercontent.com/d/1lNaLTg6NkiDcJ-AabwYT4LD8RxaaDEsU=s1000'],
      planta: [],
      isPromo: false,
      favorite: true
    },
    {
      id: 2,
      title: 'Abytá Santo Amaro',
      subtitle: '',
      description: '',
      location: 'Rua Herbert Alfred Landsberg, 27 - Santo Amaro SP',
      price: 279000,
      price_promo: 245000,
      towers: 3,
      units_available: 308,
      date: new Date('2028-12-31'),
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        suits: 0,
        balcony: true,
        area: [34, 35],
        garden: false,
        parking: 0
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: ['https://lh3.googleusercontent.com/d/11bXyQRnVmVnx9lT-Clp7c-h7EQUSoDBA=s1000'],
      planta: [
        {
          id: 1,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 279000,
          price_promo: 245000,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [34],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponivel',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1IA0WCYAZlc3A_kofwYLSLR_yMqHtDWpA=s1000',
          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Tipo Ponta',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 264000,
          price_promo: 245000,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 2,
            balcony: true,
            area: [35],
            garden: true,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponivel',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1qZY65Kbc3VqIQHQghKWTiPbgR5BJ1sQp=s1000',
          category: 'HIS-2'
        }
      ],
      isPromo: true,
      favorite: false
    },
    {
      id: 3,
      title: '011 Brooklin Residence',
      subtitle: '',
      description: '',
      location: 'Rua Caetano José Batista, 149 - Brooklin - SP',
      price: 574690,
      price_promo: 0,
      towers: 3,
      units_available: 751,
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
      type: 'Apartamento',
      status: 'Em obras',
      category: ['HIS-2'],
      imagesUrl: ['https://lh3.googleusercontent.com/d/19RMbpAtLn34a7IgNT9Un0RBlweKgw14t=s1000'],
      planta: [],
      isPromo: false,
      favorite: false
    },
    {
      id: 4,
      title: 'Pátio Central',
      subtitle: '',
      description: '',
      location: 'Rua Junqueira Freire, no 263 - Liberdade - SP',
      price: 340090,
      price_promo: 0,
      towers: 3,
      units_available: 846,
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
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: ['../../assets/patio-plantas/patiofachada.jpeg'],
      planta: [],
      isPromo: false,
      favorite: false
    }
  ]);

  // Expõe a lista como um sinal de apenas leitura para os componentes
  properties = this.propertiesList.asReadonly();

  private backgraoundImageUrl = 'https://lh3.googleusercontent.com/d/1tGDExQfFxBuc-EPEGUrDzuupFGJYg-8F=s1000';

  get backgroundImageUrl() {
    return this.backgraoundImageUrl;
  }

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

  readonly settings = signal<AppSettings>({
    siteTitle: 'Simulador Pro',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/602/602182.png',
    whatsappNumber: '5511968711986',
    whatsappMessage: 'Olá! Gostaria de mais informações'
  });

  updateSettings(newSettings: Partial<AppSettings>) {
    this.settings.update(current => ({ ...current, ...newSettings }));
    localStorage.setItem('app_settings', JSON.stringify(this.settings()));
  }
}