import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PropertyService } from './services/property';

/**
 * Definição da animação de transição entre páginas
 */
const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [slideInAnimation]
})
export class App {
  // Itens do menu usando Signals (v21)
  menuItems = signal([
    { path: '/home', label: 'Home', icon: 'dashboard', enable: true },
    { path: '/imoveis', label: 'Imóveis', icon: 'real_estate_agent', enable: true },
    { path: '/payment', label: 'Simulador', icon: 'payment', enable: true },
    { path: '/indique-ganhe', label: 'Indique e Ganhe', icon: 'celebration', enable: true },
    { path: '/trabalhe-conosco', label: 'Carreiras', icon: 'group', enable: true },
    { path: '/ajustes', label: 'Ajustes', icon: 'settings', enable: true },
    { path: '/perfil', label: 'Perfil', icon: 'person', enable: false }
  ]);

  public propertyService = inject(PropertyService);

  imageBackgroundUrl = this.propertyService.backgroundImageUrl;;
  whatappNumber = this.propertyService.settings().whatsappNumber || '';
  whatsappMensagem = this.propertyService.settings().siteTitle || 'Olá! Gostaria de mais informações';

  whatsappUrl = `https://wa.me/${this.whatappNumber}?text=${encodeURIComponent(this.whatsappMensagem)}`;

  logoSetting = signal(this.propertyService.settings().logo);

  /**
   * Prepara os dados da rota para a animação
   */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  openWhatspp() {
    window.open(this.whatsappUrl, '_blank');
  }
}