import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Ouvinte global de erros que você já tinha
    provideBrowserGlobalErrorListeners(),
    
    // Configuração de Rotas com suporte a transições de página
    provideRouter(
      routes, 
      withComponentInputBinding(), // Permite receber parâmetros da URL como @Input
      withViewTransitions()        // Habilita animações de transição nativas
    ), 
    
    // Suporte para SSR e Hidratação (Angular 21)
    provideClientHydration(withEventReplay()),
    
    // ESSENCIAL: Carrega as animações para o Angular Material e transições personalizadas
    provideAnimationsAsync()
  ]
};
