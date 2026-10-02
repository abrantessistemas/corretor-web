import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from "@angular/material/tooltip";
import { LoginDialogComponent } from './pages/login/login-dialog';
import { MenuItem, PropertyService } from './services/property';

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
    MatTooltip,
    MatDialogModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  ngOnInit() {
    // Verifica no localStorage se isBroker é 'true' ao carregar a página
    const brokerValue = localStorage.getItem('isBroker');
    if (brokerValue === 'true') {
      this.isBroker.set(true);
    }
    this.menuItems.set(this.propertyService.menuItens());
  }

  // Itens do menu usando Signals (v21)
   menuItems = signal<MenuItem[]>([]);

  private dialog = inject(MatDialog);
  private router = inject(Router);
  public propertyService = inject(PropertyService);

  imageBackgroundUrl = this.propertyService.backgroundImageUrl;
  logoSetting = signal(this.propertyService.settings().logo);
  isBroker = signal(false);

  handleMenuClick(item: any, event: Event) {
    event.preventDefault(); // Impede a navegação padrão
    this.openLoginDialog();
    this.isBroker.set(false);
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '380px'
    });

    dialogRef.afterClosed().subscribe((isLoggedSuccess) => {
      if (isLoggedSuccess) {
        // Ativa as rotas 'Simulador' (/payment) e 'Oferta Ativa' (/oferta)
        this.menuItems.update(items =>
          items.map(item => {
            if (item.path === '/payment' || item.path === '/oferta' || item.path === '/home') {
              this.router.navigate(['/home']);
              return { ...item, enable: true };
            }
            return item;
          })
        );
      }
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}