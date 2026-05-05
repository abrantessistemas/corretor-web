import { Injectable, signal } from '@angular/core';

/**
 * Interface que define a estrutura de um Imóvel
 */
export interface Property {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  state: string;
  region: string;
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
    parking: number,
    pool?: boolean,
  },
  features: string[],
  amenities: string[],
  type: 'Estudio' | 'Apartamento' | 'Suites' | 'Casa' | 'Cobertura' | 'Duplex' | 'Triplex';
  status: 'Pronto' | 'Lançamento' | 'Em obras' | '100% Vendido' | 'Em Breve';
  category: string[];
  imagesUrl: Implantacao[];
  planta: Planta[];
  isPromo?: boolean;
  favorite: boolean;
  bookUrl?: string;
}

export interface Implantacao {
  [x: string]: any;
  id: number;
  description: string;
  imagesUrl: string;
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
  status: 'Disponível' | 'Espelho' | 'Reservada' | 'Vendida' | 'Bloqueada',
  imagesUrl: string,
  category: 'HIS-1' | 'HIS-2' | 'R2V' | 'HMP'
}

export interface Incorporador {
  id: number;
  imagesUrl: string,
  title: string;
  cnpj: string;
  description: string;
  location: string;
  date?: Date;
  site: string;
}

export interface Construtora {
  id: number;
  imagesUrl: string,
  title: string;
  cnpj: string;
  description: string;
  location: string;
  date?: Date;
  site: string;
}

export interface Logo {
  id: number;
  imagesUrl: string;
  description: string;
}

/**
 * Interface para as definições globais do site
 */
export interface AppSettings {
  siteTitle: string;
  logo: Logo[];
  backgroundImageUrl: string;
  whatsappConfig: {
    whatsappContactName: string;
    whatsappNumber: string,
    whatsappMessage: string
  };
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
      state: 'São Paulo',
      region: 'Zona Sul',
      price: 383636,
      price_promo: 349990,
      towers: 1,
      units_available: 370,
      date: new Date('2029-08-31'),
      specs: {
        bedrooms: 1,
        bathrooms: 1,
        suits: 1,
        balcony: true,
        area: [26, 27, 28, 31, 36, 37, 45, 58],
        garden: true,
        parking: 0,
        pool: true,
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico'],
      amenities: ['Piscina com dack molhado', 'Salão de Festas', 'Churrasqueira', 'Coworking', 'Academia 24h', 'Lavanderia Coletiva 24h', 'Pet Place', 'Bicicletário', 'Gerador', 'Mini-Mercado'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2', 'R2V'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1lNaLTg6NkiDcJ-AabwYT4LD8RxaaDEsU=s1000'
        },
        {
          id: 2,
          description: 'Portaria',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1uGTwop-_7ZtuOZFj9Vhs2q8uPg1-MfJR=s1000'
        },
        {
          id: 3,
          description: 'Piscina',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1rBAd0-bCnOKD8-aNrJlpZa5WznUA7xJw=s1000'
        },
        {
          id: 4,
          description: 'Pet Place',
          imagesUrl: 'https://lh3.googleusercontent.com/d/10_dU9urK0Huv6t6vevo5I82tPJI6wpO1=s1000'
        },
        {
          id: 5,
          description: 'Academia',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1-z7rpU0kXlkZ_qe0_yFxP4dWvPVgXxVL=s1000'
        },
        {
          id: 6,
          description: 'Lavanderia',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1ugc9ulhLtDj2KgEhEURJ2UbM0R6ua2jN=s1000'
        },
        {
          id: 7,
          description: 'Churrasqueira',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1LATuy5V5i79b8KgCyADRdRoC2jOSf99D=s1000'
        },
        {
          id: 8,
          description: 'Lobby Externo',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1YJKE8Ot2m0v-4fE7dlIWUBneVnRwQWso=s1000'
        },
        {
          id: 9,
          description: 'Minimarket',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1ESGpEGJspcPnvwAWufqOR2tPRrnUJa9e=s1000'
        }
      ],
      planta: [
        {
          id: 1,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10]
          },
          price: 383636,
          price_promo: 349990,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [26],
            garden: false,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1UD53TYvWSM8l3KwIzejniyHgsqJe82OO=s1000',
          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Tipo Garden Meio',
          location: {
            towers: ['A'],
            floor: [4, 10]
          },
          price: 383636,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [26],
            garden: true,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1PUy4Vk3Rw5Ez2XyBm80Kirah4ZvP4THc=s1000',
          category: 'R2V'
        },
        {
          id: 3,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [20]
          },
          price: 539990,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [28],
            garden: false,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1o3NH5CbqJP8q0vnHCzhlEjs12segAm5-=s1000',
          category: 'HIS-2'
        },
        {
          id: 4,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [20]
          },
          price: 513990,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [31],
            garden: false,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/18CtnDfr28OEZAXkYODNkAtLJTrwvCSOD=s1000',
          category: 'HIS-2'
        },
        {
          id: 5,
          description: 'Planta Tipo Garden Meio',
          location: {
            towers: ['A'],
            floor: [20]
          },
          price: 513990,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [31],
            garden: false,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1O7PtRY8bSokUXT5-YV9xp10ovInDLK02=s1000',
          category: 'HIS-2'
        },
        {
          id: 6,
          description: 'Planta Tipo Garden Meio',
          location: {
            towers: ['A'],
            floor: [4, 10]
          },
          price: 559990,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [45],
            garden: true,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1O7PtRY8bSokUXT5-YV9xp10ovInDLK02=s1000',
          category: 'R2V'
        },
        {
          id: 7,
          description: 'Planta Tipo Garden Meio',
          location: {
            towers: ['A'],
            floor: [4, 10]
          },
          price: 559990,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [45],
            garden: true,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1oJXrU86u7IIQQvO-Bn957P_fmZT0Cqc7=s1000',
          category: 'R2V'
        },
        {
          id: 8,
          description: 'Planta Tipo UP Garden Ponta',
          location: {
            towers: ['A'],
            floor: [20]
          },
          price: 799990.00,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [58],
            garden: true,
            parking: 0
          },
          features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Chuveiro eletrico', ''],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1UCC23Yl3wL47DDjV_qqyBNy41Mlt4cAO=s1000',
          category: 'R2V'
        }
      ],
      isPromo: true,
      favorite: false,
      bookUrl: '',
    },
    {
      id: 2,
      title: 'Abytá Santo Amaro',
      subtitle: '',
      description: '',
      location: 'Rua Herbert Alfred Landsberg, 27 - Santo Amaro SP',
      state: 'São Paulo',
      region: 'Zona Sul',
      price: 259000,
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
        parking: 0,
        pool: false
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do Abytá Santo Amaro',
          imagesUrl: 'https://lh3.googleusercontent.com/d/11bXyQRnVmVnx9lT-Clp7c-h7EQUSoDBA=s1000'

        },
        {
          id: 2,
          description: 'Academia do Abytá Santo Amaro',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1r8zORdXHdOHJO-BTZBMhRUOjmgjiVmli=s1000'

        },
        {
          id: 3,
          description: 'Salão de jogos do Abytá Santo Amaro',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1FoQsM0WiLiZ1x-r8J16D0GHbGaiG5Tx1=s1000'
        },
        {
          id: 4,
          description: 'Playground do Abytá Santo Amaro',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1IBorsVIADRAaAHR0cts5_eAO_4YTaQOt=s1000'

        }
      ],
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
          status: 'Disponível',
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
          price: 279000,
          price_promo: 245000,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [35],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1qZY65Kbc3VqIQHQghKWTiPbgR5BJ1sQp=s1000',
          category: 'HIS-2'
        }
      ],
      isPromo: true,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1atAlq5JYhCUgLVME8aLLk4R70KDzBStr'
    },
    {
      id: 3,
      title: '011 Brooklin Residence',
      subtitle: '',
      description: '',
      location: 'Rua Caetano José Batista, 149 - Brooklin - SP',
      state: 'São Paulo',
      region: 'Zona Sul',
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
        parking: 1,
        pool: true
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
      category: ['HIS-2', 'R2V'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do 011 Brooklin Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/19RMbpAtLn34a7IgNT9Un0RBlweKgw14t=s1000'
        }
      ],
      planta: [
        {
          id: 1,
          description: 'Planta Garden Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 574690,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [65],
            garden: true,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1CVpowZSMKtdtnSAdHPuRj63Zaix8gblK=s1000',
          category: 'HIS-2'
        },
        {
          id: 1,
          description: 'Planta Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 574690,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [40],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/13aTZDBwZgRu3CKrCuP74A75CcaUIUJaQ=s1000',

          category: 'HIS-2'
        },
        {
          id: 1,
          description: 'Planta Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 574690,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [41],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1nZ7APtn-ilAlOFqRM0u0-QHD3D6ep8Qx=s1000',

          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1Bm8yFdhr8WTxRX9OWma-ut8z4YVlYWHb'
    },
    {
      id: 4,
      title: 'Pátio Central',
      subtitle: '',
      description: '',
      location: 'Rua Junqueira Freire, no 263 - Liberdade - SP',
      state: 'São Paulo',
      region: 'Centro',
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
        area: [36, 37, 38, 44],
        garden: false,
        parking: 1,
        pool: true
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
      imagesUrl: [{
        id: 1,
        description: 'Fachada do Pátio Central',
        imagesUrl: '../../assets/patio-plantas/patiofachada.jpeg'
      }],
      planta: [
        {
          id: 1,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 340090,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [36],
            garden: false,
            parking: 1
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1BOF6fGL0O33xM3-E7nNIy4SwJQJYafyG=s1000',
          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 340090,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [37, 38],
            garden: false,
            parking: 1
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1bRS39jpSDGkOM-vVCJuvfQNMLf2BkCJ5=s1000',

          category: 'HIS-2'
        },
        {
          id: 3,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 340090,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [44],
            garden: false,
            parking: 1
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1Qi1Sn_ekhQ156dQBBsDjAkgvDZyZeoIr=s1000',


          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1eHDXm61tLnYwO6itbjvjQSN-86GTI5UE'
    },
    {
      id: 5,
      title: 'Equale Condominio Clube',
      subtitle: '',
      description: '',
      location: 'Rua Rodrigo Fernandes, 55, Socorro – SP',
      state: 'São Paulo',
      region: 'Zona Sul',
      price: 269000,
      price_promo: 0,
      towers: 3,
      units_available: 308,
      date: new Date('2029-12-31'),
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        suits: 0,
        balcony: true,
        area: [34, 35, 47],
        garden: true,
        parking: 0,
        pool: true
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do e-quale Condominio Clube',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1m9s16dfH7KbgqEUyXn3JUmnOXB4VJ9KU=s1000'
        },
      ],
      planta: [
        {
          id: 1,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 279000,
          price_promo: 0,
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
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1hY6FSm0DNU0Hix4FN1Y7TXn8_RbeNHn5=s1000',

          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Tipo Ponta',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 279000,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 2,
            balcony: true,
            area: [35],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1E9MEoFloVO5YLWWsfNJadHtl1ZIAubn3=s1000',

          category: 'HIS-2'
        },
        {
          id: 3,
          description: 'Planta Garden Tipo Ponta',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 279000,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 2,
            balcony: true,
            area: [47],
            garden: true,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1PiQ6HksNB6W3Rv5AhPiGS7fOTtoB94Zu=s1000',

          category: 'HIS-2'
        },
        {
          id: 4,
          description: 'Planta Garden Tipo Meio',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 279000,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 2,
            balcony: true,
            area: [47],
            garden: true,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1l-IX4UdzF_J9g1FDnPkjqrVAaYm17Uec=s1000',

          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1CS9KQ2gTNbwiEykXM1EWZeMTZohfZgR5'

    },
    {
      id: 6,
      title: 'Signature Barra Funda Residences',
      subtitle: '',
      description: '',
      location: 'Rua Robert Bosch, 332, Barra Funda – SP',
      state: 'São Paulo',
      region: 'Zona Oeste',
      price: 584990,
      price_promo: 0,
      towers: 2,
      units_available: 308,
      date: new Date('2028-12-31'),
      specs: {
        bedrooms: 2,
        bathrooms: 1,
        suits: 0,
        balcony: true,
        area: [44, 58],
        garden: true,
        parking: 0,
        pool: true
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do Signature',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1L1wIERPnWj2kU3R3NUlmWgsiloHkrFY3=s1000'
        },
        {
          id: 2,
          description: 'Piscina do Signature',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1BLKAUlQmmSw4l-AXXblsG4is61CP9pcp=s1000'


        },
        {
          id: 3,
          description: 'Quadra do Signature',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1vnvqBa55WH6J23BcYLNS4q3199eRvK8g=s1000'


        },
      ],
      planta: [
        {
          id: 1,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 584990,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [44],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1kalBZ_Wjn8ZUyfkqY0H0__tJ0WMyEoQU=s1000',

          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Tipo Ponta',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 808990,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [58],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/10Fsb0BA2mGSXbs2ch4-qs1ZsgiAtN3pZ=s1000',

          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1khkECPzJqMUbUoUWSrXyLbBN9N319JsE'


    },
    {
      id: 7,
      title: 'Holistic Residence',
      subtitle: '',
      description: '',
      location: 'Av. Santa Marina, 1550, Barra Funda – SP',
      state: 'São Paulo',
      region: 'Zona Oeste',
      price: 461201,
      price_promo: 0,
      towers: 2,
      units_available: 308,
      date: new Date('2026-12-31'),
      specs: {
        bedrooms: 3,
        bathrooms: 1,
        suits: 1,
        balcony: false,
        area: [43, 54],
        garden: false,
        parking: 0,
        pool: true
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do holistic Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1Kp5i4WPIHgzydt2PP_6CzFNGE5X6Fp5t=s1000'
        },
        {
          id: 2,
          description: 'Piscina do holistic Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1mXGcpno1SCy9dZRBecPQ6jVCMKyGefs3=s1000'
        },
        {
          id: 3,
          description: 'Coworking do holistic Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1I3YU7UYoeobp32yr5TrijMOlgx8z8718=s1000'
        },
      ],
      planta: [
        {
          id: 1,
          description: 'Planta',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 461201,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [43],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1a3pVoO4HylETLSB0jHaZi8TUrEKIucx9=s1000',

          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 731090,
          price_promo: 0,
          specs: {
            bedrooms: 3,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [54],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1YV1qlmFzo0am3TgY3nynCm4lzcnYHVse=s1000',
          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1khkECPzJqMUbUoUWSrXyLbBN9N319JsE'
    },
    {
      id: 8,
      title: 'Estilo Lapa',
      subtitle: '',
      description: '',
      location: 'Lapa – SP',
      state: 'São Paulo',
      region: 'Zona Oeste',
      price: 0,
      price_promo: 0,
      towers: 2,
      units_available: 0,
      date: new Date('2029-12-31'),
      specs: {
        bedrooms: 2,
        bathrooms: 2,
        suits: 1,
        balcony: true,
        area: [25, 33, 37, 40, 43],
        garden: false,
        parking: 0,
        pool: true
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Em Breve',
      category: ['HIS-2'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do Estilo Lapa',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1J-S0nTjsEJ7FNgOrR-FOcpA3Mj260o34=s1000'
        },
        {
          id: 2,
          description: 'Piscina do Estilo Lapa',
          imagesUrl: 'https://lh3.googleusercontent.com/d/17R1oxneTdhbqAmC5DDK0rs69T4hYHu56=s1000'
        },
        {
          id: 3,
          description: 'Academia do Estilo Lapa',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1hyeYm39NHzXvoAsgJUHuszFbcUaqMouV=s1000'
        },
      ],
      planta: [
        {
          id: 1,
          description: 'Planta Meio',
          location: {
            towers: ['B'],
            floor: [4, 10],
          },
          price: 0,
          price_promo: 0,
          specs: {
            bedrooms: 1,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [25],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/173bj91uBN3hDsQbDBconqb8PrA4yo9ys=s1000',

          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Meio',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 0,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: false,
            area: [33],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/19DiRaOu_PJIKmqHGdcwW1_YORWTWft7Y=s1000',

          category: 'HIS-2'
        },
        {
          id: 3,
          description: 'Planta Ponta',
          location: {
            towers: ['A', 'B'],
            floor: [4, 10],
          },
          price: 0,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [37],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1ukqchTL7HknwBXmgWkwmB0QncE8Z5OjG=s1000',

          category: 'HIS-2'
        },
        {
          id: 4,
          description: 'Planta Meio',
          location: {
            towers: ['A', 'B'],
            floor: [4, 10],
          },
          price: 0,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: false,
            area: [37],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1PQ4gP-qh3yE2D3DY_Hx9Jhs7PRnVaaZ-=s1000',

          category: 'HIS-2'
        },
        {
          id: 5,
          description: 'Planta Meio',
          location: {
            towers: ['A', 'B'],
            floor: [4, 10],
          },
          price: 0,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [40],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/175pa8QZ4oZIpmTiaFrn9Ds2HjjcQKMod=s1000',

          category: 'HIS-2'
        },
        {
          id: 6,
          description: 'Planta Meio',
          location: {
            towers: ['A', 'B'],
            floor: [4, 10],
          },
          price: 0,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 0,
            balcony: true,
            area: [43],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1YIBdjUdUxj0yWfSdAV4fITcQD4l8d9Vo=s1000',
          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1khkECPzJqMUbUoUWSrXyLbBN9N319JsE'
    },
    {
      id: 9,
      title: 'Line Barra Funda Residence',
      subtitle: '',
      description: '',
      location: 'Rua Inocêncio Tobias, 136, Barra Funda – SP',
      state: 'São Paulo',
      region: 'Zona Oeste',
      price: 341127,
      price_promo: 0,
      towers: 4,
      units_available: 782,
      date: new Date('2027-06-30'),
      specs: {
        bedrooms: 3,
        bathrooms: 1,
        suits: 1,
        balcony: false,
        area: [37, 55],
        garden: false,
        parking: 0,
        pool: true
      },
      features: ['Ponto para Ar-Condicionado', 'Tomadas USB', 'Varanda com ponto grill', 'Gerador'],
      amenities: ['PORTARIA', 'HALL SOCIAL', 'SALÃO DE FESTAS', 'CHURRASQUEIRA', 'BRINQUEDOTECA', 'QUADRA'],
      type: 'Apartamento',
      status: 'Lançamento',
      category: ['HIS-2'],
      imagesUrl: [
        {
          id: 1,
          description: 'Fachada do Line Barra Funda Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/12joQdRxZH54gThGSTzvzY4QrcSw6nG8K=s1000'
        },
        {
          id: 2,
          description: 'Fitness Line Barra Funda Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1mqTHq7ITsvSm9UtXcWJ-Bjwf6XGLOoDg=s1000'
        },
        {
          id: 3,
          description: 'Churrasqueira do Line Barra Funda Residence',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1OO0HM6qGDKZiE2z8QfgKV9Y0QL88BZFv=s1000'
        },
      ],
      planta: [
        {
          id: 1,
          description: 'Planta Tipo Ponta',
          location: {
            towers: ['A'],
            floor: [4, 10],
          },
          price: 461201,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [37],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação natual'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1SXUt_jk6-kZ0UktV8IIle-NqufHC6Mkq=s1000',
          category: 'HIS-2'
        },
        {
          id: 2,
          description: 'Planta Tipo Meio',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 731090,
          price_promo: 0,
          specs: {
            bedrooms: 3,
            bathrooms: 1,
            suits: 1,
            balcony: true,
            area: [37],
            garden: false,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/1BRb0SjfM6UPIYrmjWeGMMiGinoz9VGHw=s1000',
          category: 'HIS-2'
        },
        {
          id: 3,
          description: 'Planta Garden Tipo Ponta',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 731090,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [55, 88],
            garden: true,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/11XU9eWsvVMrPOJOMS1OddRTwWXZr0iqf=s1000',
          category: 'HIS-2'
        },
        {
          id: 4,
          description: 'Planta Garden Tipo Meio',
          location: {
            towers: ['A', 'B', 'C'],
            floor: [2, 8],
          },
          price: 731090,
          price_promo: 0,
          specs: {
            bedrooms: 2,
            bathrooms: 1,
            suits: 1,
            balcony: false,
            area: [55, 88],
            garden: true,
            parking: 0
          },
          features: [
            'Ponto para Ar-Condicionado',
            'Tomadas USB',
            'Varanda com ponto grill',
            'Ventilação Exaustiva'
          ],
          status: 'Disponível',
          imagesUrl: 'https://lh3.googleusercontent.com/d/vf=s1000',
          category: 'HIS-2'
        }
      ],
      isPromo: false,
      favorite: false,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1Ynw7MgoOy6m5-Q6085aRXuLu2pKlNCmNE'
    }
  ]);

  // Expõe a lista como um sinal de apenas leitura para os componentes
  properties = this.propertiesList.asReadonly();


  get backgroundImageUrl() {
    return this.settings().backgroundImageUrl;
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

  readonly settings = signal<AppSettings>(
    {
      siteTitle: 'Projetos na Planta Adriano',
      logo: [
        {
          id: 1,
          imagesUrl: 'https://lh3.googleusercontent.com/d/1crj6kBODBxAqSNGgBol6cuyZwldQsnf8=s1000',
          description: 'Projetos na planta'//max 18 character
        }
      ],
      backgroundImageUrl: 'https://lh3.googleusercontent.com/d/17R1oxneTdhbqAmC5DDK0rs69T4hYHu56=s1000',
      whatsappConfig:
      {
        whatsappContactName: 'Adriano Abrantes',
        whatsappNumber: '5511968711986',
        whatsappMessage: 'Olá! Gostaria de obter mais informações',
      }
    }
  );

  updateSettings(newSettings: Partial<AppSettings>) {
    this.settings.update(current => ({ ...current, ...newSettings }));
    localStorage.setItem('app_settings', JSON.stringify(this.settings()));
  }
}