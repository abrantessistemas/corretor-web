import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'login-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      {{ isPrimeiroAcesso() ? 'Criar Novo Acesso' : 'Acessar Conta' }}
    </h2>

    <mat-dialog-content class="dialog-content">
      @if (!isPrimeiroAcesso()) {
        <form [formGroup]="loginForm" (ngSubmit)="onSubmitLogin()" id="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuário</mat-label>
            <input matInput formControlName="usuario" placeholder="Digite seu usuário" />
            @if (loginForm.controls.usuario.hasError('required')) {
              <mat-error>Informe o usuário</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha</mat-label>
            <input
              matInput
              [type]="hideSenhaLogin() ? 'password' : 'text'"
              formControlName="senha"
              placeholder="Digite sua senha"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              class="toggle-pass"
              (click)="hideSenhaLogin.set(!hideSenhaLogin())"
            >
              {{ hideSenhaLogin() ? '👁️' : '🙈' }}
            </button>
            @if (loginForm.controls.senha.hasError('required')) {
              <mat-error>Informe a senha</mat-error>
            }
          </mat-form-field>

          @if (loginForm.hasError('invalidCredentials')) {
            <mat-error class="global-error">Usuário ou senha incorretos.</mat-error>
          }
        </form>
      } @else {
        <form [formGroup]="cadastroForm" (ngSubmit)="onSalvarNovoUsuario()" id="cadastro-form">
          <p class="info-text">Primeiro acesso validado! Crie seu usuário e senha:</p>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Novo Usuário</mat-label>
            <input matInput formControlName="novoUsuario" placeholder="Escolha um usuário" />
            @if (cadastroForm.controls.novoUsuario.hasError('required')) {
              <mat-error>Usuário é obrigatório</mat-error>
            }
            @if (cadastroForm.controls.novoUsuario.hasError('userExists')) {
              <mat-error>Usuário já em uso</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nova Senha</mat-label>
            <input
              matInput
              [type]="hideNovaSenha() ? 'password' : 'text'"
              formControlName="novaSenha"
              placeholder="Crie uma nova senha"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              class="toggle-pass"
              (click)="hideNovaSenha.set(!hideNovaSenha())"
            >
              {{ hideNovaSenha() ? '👁️' : '🙈' }}
            </button>
            @if (cadastroForm.controls.novaSenha.hasError('required')) {
              <mat-error>Senha é obrigatória</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar Nova Senha</mat-label>
            <input
              matInput
              [type]="hideConfirmarSenha() ? 'password' : 'text'"
              formControlName="confirmarSenha"
              placeholder="Confirme a nova senha"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              class="toggle-pass"
              (click)="hideConfirmarSenha.set(!hideConfirmarSenha())"
            >
              {{ hideConfirmarSenha() ? '👁️' : '🙈' }}
            </button>
            @if (cadastroForm.controls.confirmarSenha.hasError('required')) {
              <mat-error>Confirmação é obrigatória</mat-error>
            }
            @if (cadastroForm.hasError('senhasDiferentes') && cadastroForm.controls.confirmarSenha.touched) {
              <mat-error>As senhas não coincidem</mat-error>
            }
          </mat-form-field>
        </form>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      @if (!isPrimeiroAcesso()) {
        <button mat-raised-button color="primary" type="submit" form="login-form" [disabled]="loginForm.invalid">
          Entrar
        </button>
      } @else {
        <button mat-raised-button color="primary" type="submit" form="cadastro-form" [disabled]="cadastroForm.invalid">
          Salvar
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { margin-bottom: 0; }
    .dialog-content { min-width: 280px; padding-top: 12px !important; }
    .full-width { width: 100%; margin-top: 4px; }
    .info-text { font-size: 13px; color: #666; margin: 0 0 12px 0; }
    .global-error { font-size: 12px; margin-bottom: 8px; display: block; }
    .toggle-pass { font-size: 14px; line-height: 1; border: none; background: transparent; cursor: pointer; }
  `]
})
export class LoginDialogComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  readonly isPrimeiroAcesso = signal(false);
  readonly hideSenhaLogin = signal(true);
  readonly hideNovaSenha = signal(true);
  readonly hideConfirmarSenha = signal(true);

  readonly loginForm = this.fb.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required]
  });

  readonly cadastroForm = this.fb.group(
    {
      novoUsuario: ['', Validators.required],
      novaSenha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    },
    {
      validators: (group: AbstractControl) => {
        const pass = group.get('novaSenha')?.value;
        const confirm = group.get('confirmarSenha')?.value;
        return pass && confirm && pass !== confirm ? { senhasDiferentes: true } : null;
      }
    }
  );

  /** Criptografia ultra simples concatenando usuario + senha e convertendo para Base64 invertido */
  private criptografar(user: string, pass: string): string {
    const raw = `${user}:${pass}`;
    return btoa(raw).split('').reverse().join('');
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) return;
    const { usuario, senha } = this.loginForm.getRawValue();

    if (this.autenticar(usuario.trim().toLowerCase(), senha.trim())) {
      this.dialogRef.close(true);
    } else if (!this.isPrimeiroAcesso()) {
      this.loginForm.setErrors({ invalidCredentials: true });
    }
  }

  private autenticar(user: string, pass: string): boolean {
    const data = new Date();
    const somaData = data.getDate() + (data.getMonth() + 1) + data.getFullYear();

    // 1. Consulta LocalStorage (compara o hash criptografado gerado na tentativa com o salvo)
    const saved = localStorage.getItem(`user_${user}`);
    if (saved) {
      try {
        const hashTentativa = this.criptografar(user, pass);
        return JSON.parse(saved).token === hashTentativa;
      } catch {
        localStorage.removeItem(`user_${user}`);
      }
    }

    // 2. Primeiro acesso (user_01 + somaData)
    if (user === 'user_01' && pass === 'user_01' + somaData) {
      this.isPrimeiroAcesso.set(true);
      return false;
    }

    // 3. Admin por último
    return user === 'admin' && pass === 'admin' + somaData;
  }

  onSalvarNovoUsuario(): void {
    if (this.cadastroForm.invalid) return;
    const { novoUsuario, novaSenha } = this.cadastroForm.getRawValue();
    const userClean = novoUsuario.trim().toLowerCase();
    const passClean = novaSenha.trim();

    if (localStorage.getItem(`user_${userClean}`)) {
      this.cadastroForm.controls.novoUsuario.setErrors({ userExists: true });
      return;
    }

    // Criptografa 'usuario:senha' antes de salvar no localStorage
    const tokenCriptografado = this.criptografar(userClean, passClean);

    localStorage.setItem(
      `user_${userClean}`,
      JSON.stringify({
        usuario: userClean,
        token: tokenCriptografado,
        createdAt: new Date().toISOString()
      })
    );

    this.dialogRef.close(true);
  }
}