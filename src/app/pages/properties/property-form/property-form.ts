import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyFormComponent {
  // Estado reativo para as imagens
  images = signal<string[]>([]);
  isSubmitting = signal(false);

  infoForm: FormGroup;
  addressForm: FormGroup;
  detailsForm: FormGroup;

  constructor(private fb: FormBuilder, public router: Router) {
    this.infoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      type: ['Venda', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });

    this.addressForm = this.fb.group({
      zipCode: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });

    this.detailsForm = this.fb.group({
      bedrooms: [1, Validators.required],
      bathrooms: [1, Validators.required],
      area: [null, Validators.required],
      parkingSlots: [0],
      isFurnished: [false]
    });
  }

  /**
   * Simula a seleção de arquivos e gera URLs de pré-visualização
   */
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.update(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * Remove uma imagem da lista de pré-visualização
   */
  removeImage(index: number): void {
    this.images.update(prev => prev.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.infoForm.valid && this.addressForm.valid && this.detailsForm.valid) {
      this.isSubmitting.set(true);

      const payload = {
        ...this.infoForm.value,
        ...this.addressForm.value,
        ...this.detailsForm.value,
        gallery: this.images()
      };

      console.log('Imóvel Cadastrado:', payload);

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.router.navigate(['/imoveis']);
      }, 1500);
    }
  }
}