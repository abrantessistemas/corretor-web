import { Routes } from '@angular/router';
import { authGuard } from './pages/login/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'imoveis',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    canActivate: [authGuard],
    data: { animation: 'HomePage' }
  },
  {
    path: 'imoveis',
    loadComponent: () => import('./pages/properties/property-list/property-list').then(m => m.PropertyListComponent),
    data: { animation: 'AjustesPage' }
  },
  {
    path: 'imoveis/novo',
    loadComponent: () => import('./pages/properties/property-form/property-form').then(m => m.PropertyFormComponent),
    canActivate: [authGuard], // 🔒 Protegido por autenticação
    data: { animation: 'Form' }
  },
  {
    path: 'imoveis/:id',
    loadComponent: () => import('./pages/properties/property-details/property-details').then(m => m.PropertyDetailsComponent),
    canActivate: [authGuard],
    data: { animation: 'DetailsPage' }
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/properties/favorite-list/favorite-list').then(m => m.FavoriteListComponent),
    data: { animation: 'FavoritesPage' }
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes').then(m => m.AjustesComponent),
    canActivate: [authGuard], // 🔒 Protegido por autenticação
    data: { animation: 'AjustesPage' }
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment/payment').then(m => m.Payment),
    canActivate: [authGuard], // 🔒 Protegido por autenticação
    data: { animation: 'PaymentPage' }
  },
  {
    path: 'oferta',
    loadComponent: () => import('./pages/outbound-offer/outbound-offer').then(m => m.OutboundOffer),
    canActivate: [authGuard],
    data: { animation: 'OfertaPage' }
  },
  {
    path: '**',
    redirectTo: 'imoveis'
  }
];