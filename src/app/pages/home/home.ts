import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property';
import { Router, RouterLink } from '@angular/router';
import { PropertyListComponent } from '../properties/property-list/property-list';
import { RoletaCorretoresComponent } from "../../shared/roleta/roleta";
import { WelcomeDialogComponent } from '../../shared/welcome-dialog/welcome-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    PropertyListComponent,
    RoletaCorretoresComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Injeção do serviço de propriedades
  private propertyService = inject(PropertyService);
  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('visited')) {
      this.openWelcomeDialog();
    }
  }


  openWelcomeDialog(): void {
    const dialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: '550px',
      maxWidth: '90vw',
      disableClose: true, // Impede fechar clicando fora
      hasBackdrop: true,  // Garante que o fundo escuro apareça
      backdropClass: 'backdrop-escura-total', // Classe customizada para o fundo
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '200ms'
    });

    dialogRef.afterClosed().subscribe((isBroker: boolean | undefined) => {
      if (isBroker === true) {
        localStorage.setItem('isBroker', String(isBroker));
        this.router.navigate(['/planos']);
      } else {
        localStorage.setItem('visited', 'true');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * Signal computado que reage automaticamente a mudanças na lista de imóveis.
   * Retorna o total de itens presentes no serviço.
   */
  public totalProperties = computed(() => this.propertyService.properties().length);

}
