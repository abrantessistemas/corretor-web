import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'imoveis/:id',
    renderMode: RenderMode.Server // A página será gerada sob demanda no servidor
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // O restante continua estático
  }
];