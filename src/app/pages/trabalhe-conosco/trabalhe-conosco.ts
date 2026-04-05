// corretor-form.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-trabalhe-conosco',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatDatepickerModule
  ],
  templateUrl: './trabalhe-conosco.html',
  styleUrl: './trabalhe-conosco.scss',
  standalone: true,
  providers: [
    provideNgxMask(), // Configura o provedor da máscara
    provideNativeDateAdapter()
  ],
})
export class TrabalheConosco {
  private fb = inject(FormBuilder);

  // Lista de UFs (exemplo simplificado)
  estados = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'GO', 'MT', 'MS', 'DF'];

  corretorForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    sobrenome: ['', [Validators.required, Validators.minLength(3)]],
    rg: ['', Validators.required],
    cpf: ['', Validators.required],
    genero: ['', Validators.required],
    data_nascimento: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.minLength(14)]],
    uf: ['', Validators.required],
    creci: ['', Validators.required]
  });

  onSubmit() {
    if (this.corretorForm.valid) {
      const dados = this.corretorForm.value;
      console.log('Enviando para o banco de dados:', dados);
      // Aqui você chamaria seu serviço: this.corretorService.create(dados).subscribe();
    }
  }
}