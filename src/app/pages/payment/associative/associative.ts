import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { PdfGenerationComponent } from '../../../shared/pdf-generation/pdf-generation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-associative',
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
  templateUrl: './associative.html',
  styleUrl: './associative.scss'
})
export class AssociativeComponent implements OnInit {
  constructor(private dialog: MatDialog, private http: HttpClient) { }


  private fb = inject(FormBuilder);

  associativeForm!: FormGroup;
  today = new Date();

  // Sinal para os dados calculados em tempo real
  readonly calculation = signal<any>({});


  ngOnInit() {
    this.initForm();
    this.associativeForm.valueChanges.subscribe(() => this.runCalculations());
    this.runCalculations();
  }

  private initForm() {
    this.associativeForm = this.fb.group({
      nomeTabelaCalculo: ['Associativo'],
      nomeCliente: ['', [Validators.required]],
      nomeCorretor: ['', [Validators.required]],
      salario: [0, [Validators.required, Validators.min(1)]],
      valorVenda: [0, [Validators.required, Validators.min(1)]],
      valorAvaliacao: [0],
      valorMorando: [0, [Validators.required, Validators.min(1)]],
      prazoMensaisMorando: [0, [Validators.required, Validators.min(1)]],
      // Regra 1: Mínimo de 500 para o Ato
      valorAto: [0, [Validators.required, Validators.min(100)]],
      valorFinanciamento: [0, [Validators.required, Validators.min(1)]],
      possuiFgts: ['nao'],
      valorFgts: [0, [Validators.min(1)]],

      desejaAnuais: [false],
      qtdAnuais: [0, [Validators.min(1)]],
      // Regra 2: O valor de cada anual será validado no cálculo em relação ao salário
      valorCadaAnual: [0, [Validators.min(1)]],
      valorObra: [0, [Validators.min(1)]],
      prazoMensais: [12, [Validators.min(1),Validators.max(84)]]
    });
  }

  // Estado interno
  progress = signal<number>(10);

  // Escala de percentuais para a régua
  ticks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Cálculo derivado reativo
  valorProporcional = computed(() => {
    return (this.associativeForm.value.valorMorando * (this.progress() / 100)) + this.calculation().valorMensal;
  });

  valorProgressao = computed(() => {
    const valor = (this.associativeForm.value.valorMorando * (this.progress() / 100));
    this.associativeForm.get('valorObra')?.setValue(valor);
    return valor;
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
    const f = this.associativeForm.getRawValue();

    const entradaTotalCaixa = f.valorVenda - f.valorFinanciamento;
    const fgts = f.possuiFgts === 'sim' ? f.valorFgts : 0;
    const entradaAdic = f.possuiEntrada === 'sim' ? f.valorEntradaAdicional : 0;

    const valorTotalReforcos = f.desejaAnuais ? (f.qtdAnuais * f.valorCadaAnual) : 0;

    const saldoParaMensais = entradaTotalCaixa - f.valorAto - fgts - entradaAdic - valorTotalReforcos;
    const valorMensal = saldoParaMensais > 0 ? (saldoParaMensais / f.prazoMensais) : 0;

    const anosReforcos: number[] = [];
    const anoInicio = this.today.getFullYear();

    for (let i = 0; i <= (f.qtdAnuais - 1); i++) {
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
  imprimirResumo() {
    const relatorio = this.associativeForm.value;
    this.dialog.open(PdfGenerationComponent, { data: relatorio }).afterClosed().subscribe();
    this.enviarFormulario(relatorio);
  }

  enviarFormulario(dados: any) {
    this.http.post('/api/contato', dados).subscribe({
      next: (res) => console.log('Dados salvos com sucesso!', res),
      error: (err) => console.error('Erro ao salvar', err)
    });
  }
}