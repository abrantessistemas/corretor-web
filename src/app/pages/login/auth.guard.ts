import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const dialog = inject(MatDialog);

  // 1. Checa a sessão ativa
  const sessionActive = sessionStorage.getItem('isLoggedIn') === 'true';

  if (sessionActive) {
    return true;
  }

  // 2. Carregamento dinâmico do modal com import()
  const { LoginDialogComponent } = await import('./login-dialog');

  const dialogRef = dialog.open(LoginDialogComponent, {
    disableClose: true,
    width: '400px',
    restoreFocus: false
  });

  // 3. Converte o Observable após o encerramento do diálogo numa Promise<boolean>
  const result = await firstValueFrom(dialogRef.afterClosed());
  return Boolean(result);
};