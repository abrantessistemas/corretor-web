import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-indique-ganhe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './indique-ganhe.html',
  styleUrls: ['./indique-ganhe.scss']
})
export class IndiqueGanhe {
  pixType = signal<string>('Não identificado');

  referralForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    source: new FormControl('', [Validators.required]),
    pixKey: new FormControl('', [Validators.required])
  });

  validatePix() {
    const key = this.referralForm.get('pixKey')?.value || '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$|^(\(?\d{2}\)?\s?)(\d{4,5}-\d{4})$/;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    let type = 'Inválido';
    let isValid = false;

    // Normalização para validação
    const cleanKey = key.trim();
    const onlyNumbers = cleanKey.replace(/\D/g, '');

    if (emailRegex.test(cleanKey)) {
      type = 'E-mail';
      isValid = true;
    } else if (cpfRegex.test(onlyNumbers) && onlyNumbers.length === 11) {
      type = 'CPF';
      isValid = true;
    } else if (phoneRegex.test(onlyNumbers) && (onlyNumbers.length >= 10 && onlyNumbers.length <= 11)) {
      type = 'Telemóvel';
      isValid = true;
    } else if (uuidRegex.test(cleanKey)) {
      type = 'Chave Aleatória';
      isValid = true;
    } else if (cleanKey === '') {
      type = 'Aguardando...';
      isValid = false;
    }

    this.pixType.set(type);

    if (!isValid && cleanKey !== '') {
      this.referralForm.get('pixKey')?.setErrors({ invalidPix: true });
    } else {
      this.referralForm.get('pixKey')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.referralForm.valid) {
      // Simulação de envio
      console.log('Dados submetidos:', this.referralForm.value);
      this.referralForm.reset();
      this.pixType.set('Não identificado');
      // No mundo real, aqui exibiríamos um feedback visual customizado
    }
  }
}