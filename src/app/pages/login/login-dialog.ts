import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
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
            <input matInput formControlName="usuario" autocomplete="username" placeholder="Digite seu usuário" />
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
              autocomplete="current-password"
              placeholder="Digite sua senha"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              aria-label="Alternar visibilidade da senha"
              (click)="hideSenhaLogin.set(!hideSenhaLogin())"
            >
              <mat-icon>{{ hideSenhaLogin() ? 'visibility_off' : 'visibility' }}</mat-icon>
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
            <input matInput formControlName="novoUsuario" autocomplete="username" placeholder="Escolha um usuário" />
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
              autocomplete="new-password"
              placeholder="Crie uma nova senha"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              aria-label="Alternar visibilidade da senha"
              (click)="hideNovaSenha.set(!hideNovaSenha())"
            >
              <mat-icon>{{ hideNovaSenha() ? 'visibility_off' : 'visibility' }}</mat-icon>
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
              autocomplete="new-password"
              placeholder="Confirme a nova senha"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              aria-label="Alternar visibilidade da senha"
              (click)="hideConfirmarSenha.set(!hideConfirmarSenha())"
            >
              <mat-icon>{{ hideConfirmarSenha() ? 'visibility_off' : 'visibility' }}</mat-icon>
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
        <button mat-flat-button color="primary" type="submit" form="login-form" [disabled]="loginForm.invalid || isSubmitting()">
          Entrar
        </button>
      } @else {
        <button mat-flat-button color="primary" type="submit" form="cadastro-form" [disabled]="cadastroForm.invalid || isSubmitting()">
          Salvar
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; }
    .dialog-title { margin-bottom: 0; }
    .dialog-content { min-width: 280px; padding-top: 12px !important; }
    .full-width { width: 100%; margin-top: 4px; }
    .info-text { font-size: 13px; color: var(--mat-sys-on-surface-variant, #666); margin: 0 0 12px 0; }
    .global-error { font-size: 12px; margin-bottom: 8px; display: block; }
  `]
})
export class LoginDialogComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  readonly isPrimeiroAcesso = signal(false);
  readonly isSubmitting = signal(false);
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

  private async hashCredentials(user: string, pass: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${user}:${pass}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async onSubmitLogin(): Promise<void> {
    if (this.loginForm.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const { usuario, senha } = this.loginForm.getRawValue();
    const userClean = usuario.trim().toLowerCase();
    const passClean = senha.trim();

    try {
      const isAuthenticated = await this.autenticar(userClean, passClean);
      if (isAuthenticated) {
        sessionStorage.setItem('isLoggedIn', 'true');
        this.dialogRef.close(true);
      } else if (!this.isPrimeiroAcesso()) {
        this.loginForm.setErrors({ invalidCredentials: true });
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onSalvarNovoUsuario(): Promise<void> {
    if (this.cadastroForm.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const { novoUsuario, novaSenha } = this.cadastroForm.getRawValue();
    const userClean = novoUsuario.trim().toLowerCase();
    const passClean = novaSenha.trim();

    if (localStorage.getItem(`user_${userClean}`)) {
      this.cadastroForm.controls.novoUsuario.setErrors({ userExists: true });
      this.isSubmitting.set(false);
      return;
    }

    const tokenHash = await this.hashCredentials(userClean, passClean);

    localStorage.setItem(
      `user_${userClean}`,
      JSON.stringify({ 
        usuario: userClean, 
        token: tokenHash, 
        createdAt: new Date().toISOString() 
      })
    );

    sessionStorage.setItem('isLoggedIn', 'true');
    this.dialogRef.close(true);
  }

  private async autenticar(user: string, pass: string): Promise<boolean> {
    const data = new Date();
    const somaData = data.getDate() + (data.getMonth() + 1) + data.getFullYear();

    const saved = localStorage.getItem(`user_${user}`);
    if (saved) {
      try {
        const hashTentativa = await this.hashCredentials(user, pass);
        return JSON.parse(saved).token === hashTentativa;
      } catch {
        localStorage.removeItem(`user_${user}`);
      }
    }

    if (user === 'user_01' && pass === 'user_01' + somaData) {
      this.isPrimeiroAcesso.set(true);
      return false;
    }

    return user === 'admin' && pass === 'admin' + somaData;
  }
}