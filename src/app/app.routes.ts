import { Routes } from '@angular/router';
import { PropertyDetailsComponent } from './pages/properties/property-details/property-details';

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
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes').then(m => m.AjustesComponent),
    data: { animation: 'AjustesPage' }
  },
  {
    path: 'trabalhe-conosco',
    loadComponent: () => import('./pages/trabalhe-conosco/trabalhe-conosco').then(m => m.TrabalheConosco),
    data: { animation: 'AjustesPage' }
  },
  // Rota de fallback para 404 ou redirecionamento
  {
    path: '**',
    redirectTo: 'home'
  }
];
