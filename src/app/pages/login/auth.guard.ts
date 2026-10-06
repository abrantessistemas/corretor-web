import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './login-dialog';

export const authGuard: CanActivateFn = () => {
    const dialog = inject(MatDialog);

    // 1. Verifica se já existe qualquer sessão/usuário ativo salvo no sessionStorage ou localStorage
    const sessionActive = sessionStorage.getItem('isLoggedIn') === 'true';

    if (sessionActive) {
        return true;
    }

    // 2. Se não estiver logado, abre o dialog de login
    const dialogRef = dialog.open(LoginDialogComponent, {
        disableClose: true,
        width: '400px'
    });

    // Retorna um Observable que emite true se o login foi concluído com sucesso (dialogRef.close(true))
    return dialogRef.afterClosed();
};