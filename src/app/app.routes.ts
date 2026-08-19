import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    data: { animation: 'HomePage' }
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil),
    data: { animation: 'PerfilPage' }
  },
  {
    path: 'imoveis',
    loadComponent: () => import('./pages/properties/property-list/property-list').then(m => m.PropertyListComponent),
    data: { animation: 'AjustesPage' }
  },
  {
    path: 'imoveis/novo',
    loadComponent: () => import('./pages/properties/property-form/property-form').then(m => m.PropertyFormComponent),
    data: { animation: 'Form' }
  },
  {
    path: 'imoveis/:id',
    loadComponent: () => import('./pages/properties/property-details/property-details').then(m => m.PropertyDetailsComponent),
    data: { animation: 'DetailsPage' }
  }, {
    path: 'imoveis/select/:id',
    loadComponent: () => import('./pages/properties/property-select/property-select').then(m => m.PropertySelect),
    data: { animation: 'SelectPage' }
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes').then(m => m.AjustesComponent),
    data: { animation: 'AjustesPage' }
  },
  {
    path: 'indique-ganhe',
    loadComponent: () => import('./pages/indique-ganhe/indique-ganhe').then(m => m.IndiqueGanhe),
    data: { animation: 'IndiqueGanhePage' }
  },
  {
    path: 'trabalhe-conosco',
    loadComponent: () => import('./pages/trabalhe-conosco/trabalhe-conosco').then(m => m.TrabalheConosco),
    data: { animation: 'TrabalheConoscoPage' }
  },
  {
    path: 'planos',
    loadComponent: () => import('./pages/planos/planos').then(m => m.PlanosComponent),
    data: { animation: 'PlanosPage' }
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment/payment').then(m => m.Payment),
    data: { animation: 'PaymentPage' }
  },
  {
    path: 'oferta',
    loadComponent: () => import('./pages/outbound-offer/outbound-offer').then(m => m.OutboundOffer),
    data: { animation: 'OfertaPage' }
  },
  // Rota de fallback para 404 ou redirecionamento
  {
    path: '**',
    redirectTo: 'home'
  }
];
