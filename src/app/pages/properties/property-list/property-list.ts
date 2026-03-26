import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

// O caminho foi ajustado para garantir que o Angular encontre o serviço corretamente
// Certifique-se de que o arquivo existe em: src/app/services/property.service.ts
import { PropertyService } from '../../../services/property';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { PropertySlide } from "../property-slide/property-slide";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    PropertySlide,
    MatTooltipModule
],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyListComponent {
  // Utilizando a injeção de dependências moderna do Angular
  private router = inject(Router);
  /**
   * Injeção do serviço de propriedades.
   * Usando o padrão de injeção do Angular 21.
   */
  public propertyService = inject(PropertyService);

  /**
   * Navega para o formulário de cadastro de um novo imóvel.
   * Certifique-se de que a rota 'imoveis/novo' está configurada no app.routes.ts
   */
  irParaCadastro(): void {
    this.router.navigate(['/imoveis/novo']);
  }

  /**
   * Método para visualizar os detalhes de um imóvel específico.
   * @param id Identificador único do imóvel.
   */
  verDetalhes(id: number): void {
    console.log('Navegar para os detalhes do imóvel:', id);
    // Futuramente aqui teremos a navegação via Router para a página de detalhes
  }

  /**
   * Método para registrar interesse em um imóvel.
   * @param title Título do imóvel para referência.
   */
  registrarInteresse(title: string): void {
    console.log('Interesse registrado para:', title);
    // Aqui poderíamos abrir um formulário de contato ou enviar um lead
  }
}