import { Component, OnInit, signal, computed, inject, input } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-payment-flow',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    CurrencyPipe,
    DatePipe,
    PercentPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CurrencyPipe,
    PercentPipe,
    MatSliderModule
  ],
  templateUrl: './payment-flow.html',
  styleUrl: './payment-flow.scss'
})
export class PaymentFlowComponent implements OnInit {
  private fb = inject(FormBuilder);

  paymentForm!: FormGroup;
  today = new Date();

  // Sinal para os dados calculados em tempo real
  readonly calculation = signal<any>({});

  ngOnInit() {
    this.initForm();
    this.paymentForm.valueChanges.subscribe(() => this.runCalculations());
    this.runCalculations();
  }

  private initForm() {
    this.paymentForm = this.fb.group({
      salario: [0, [Validators.required, Validators.min(1)]],
      valorVenda: [0, [Validators.required]],
      valorAvaliacao: [0],
      valorMorando: [0, [Validators.required]],
      // Regra 1: Mínimo de 500 para o Ato
      valorAto: [0, [Validators.required, Validators.min(500)]],
      valorFinanciamento: [0],

      possuiFgts: ['nao'],
      valorFgts: [0],

      possuiEntrada: ['nao'],
      valorEntradaAdicional: [0],

      desejaAnuais: [true],
      qtdAnuais: [0],
      // Regra 2: O valor de cada anual será validado no cálculo em relação ao salário
      valorCadaAnual: [0, [Validators.required, Validators.min(0)]],

      prazoMensais: [12]
    });
  }

  // Input reativo (Signal)
  valorMorando = input.required<number>();

  // Estado interno
  progress = signal<number>(10);

  // Escala de percentuais para a régua
  ticks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Cálculo derivado reativo
  valorProporcional = computed(() => {
    return (this.valorMorando() * this.progress()) / 100;
  });

  updateProgress(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.progress.set(Number(value));
  }

  selectAll(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  runCalculations() {
    const f = this.paymentForm.getRawValue();

    const entradaTotalCaixa = f.valorVenda - f.valorFinanciamento;
    const fgts = f.possuiFgts === 'sim' ? f.valorFgts : 0;
    const entradaAdic = f.possuiEntrada === 'sim' ? f.valorEntradaAdicional : 0;

    const valorTotalReforcos = f.desejaAnuais ? (f.qtdAnuais * f.valorCadaAnual) : 0;

    const saldoParaMensais = entradaTotalCaixa - f.valorAto - fgts - entradaAdic - valorTotalReforcos;
    const valorMensal = saldoParaMensais > 0 ? (saldoParaMensais / f.prazoMensais) : 0;

    const anosReforcos: number[] = [];
    const anoInicio = this.today.getFullYear();
    
    for (let i = 1; i <= f.qtdAnuais; i++) {
      anosReforcos.push(anoInicio + i);
    }

    // Lógica de Validação de Negócio
    const limiteReforco = f.salario * 0.50; // 50% do salário
    const reforcoExcedido = f.valorCadaAnual > limiteReforco;
    const parcelaAcimaSalario = valorMensal > (f.salario * 0.3);

    this.calculation.set({
      entradaTotalCaixa,
      fgts,
      entradaAdic,
      valorTotalReforcos,
      saldoParaMensais: saldoParaMensais > 0 ? saldoParaMensais : 0,
      valorMensal: valorMensal > 0 ? valorMensal : 0,
      anosReforcos,
      valorCadaAnual: f.valorCadaAnual,
      limiteReforco,
      reforcoExcedido,
      parcelaAcimaSalario
    });
  }
}