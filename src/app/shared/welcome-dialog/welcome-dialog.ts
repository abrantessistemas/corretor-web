import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './welcome-dialog.html',
  styleUrls: ['./welcome-dialog.scss']
})
export class WelcomeDialogComponent {
  constructor(private dialogRef: MatDialogRef<WelcomeDialogComponent>) { }

  selectOption(isBroker: boolean): void {
    // Fecha o dialog retornando a escolha do usuário
    this.dialogRef.close(isBroker);
  }
}