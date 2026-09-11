import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Acessar Conta</h2>
    
    <mat-dialog-content>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" id="login-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Usuário</mat-label>
          <input matInput formControlName="usuario" placeholder="Digite seu usuário" />
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput type="password" formControlName="senha" placeholder="Digite sua senha" />
          <mat-icon matPrefix>lock</mat-icon>
        </mat-form-field>

        @if(loginForm.errors) {
          <small>Usuário ou senha incorretos.</small>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" type="submit" form="login-form" [disabled]="loginForm.invalid">
        Entrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-top: 8px;
    }
  `]
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  loginForm: FormGroup = this.fb.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const data = new Date();
      const dia = data.getDate();
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();

      const password = 'admin' + (dia + mes + ano);

      if (this.loginForm.value.usuario === 'admin' && this.loginForm.value.senha === password) {
        this.dialogRef.close(true);
      } else {
        this.loginForm.setErrors({ invalidCredentials: true });
      }
    }
  }
}