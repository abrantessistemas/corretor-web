import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property';
import { RouterLink } from '@angular/router';
import { PropertyListComponent } from '../properties/property-list/property-list';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    PropertyListComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
   // Injeção do serviço de propriedades
  private propertyService = inject(PropertyService);

  /**
   * Signal computado que reage automaticamente a mudanças na lista de imóveis.
   * Retorna o total de itens presentes no serviço.
   */
  public totalProperties = computed(() => this.propertyService.properties().length);

}
