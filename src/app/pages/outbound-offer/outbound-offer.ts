import { Component, inject, signal, ViewChild, AfterViewInit, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PropertyService } from '../../services/property';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  projeto?: string;
  enviado?: boolean;
}

export interface ColumnConfig {
  key: keyof Lead | 'acoes';
  label: string;
}

@Component({
  selector: 'app-outbound-offer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './outbound-offer.html',
  styleUrl: './outbound-offer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundOffer implements AfterViewInit, OnInit {
  public propertyService = inject(PropertyService);
  private readonly LOCAL_STORAGE_KEY = 'mensagens_outbound_list';

  readonly columns: ColumnConfig[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'acoes', label: 'Ações' }
  ];

  readonly displayedColumns = this.columns.map(c => c.key);
  readonly dataSource = new MatTableDataSource<Lead>([]);

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Lista de mensagens padrão caso não exista nada salvo no navegador
  private readonly mensagensPadrao: string[] = [
    'Olá! Gostaria de obter mais informações sobre o imóvel.',
    'Oi! Temos condições especiais de pagamento este mês.',
    'Olá! Gostaria de agendar uma visita ao decorado?'
  ];

  mensagem = new FormControl('Olá');
  intervalo = new FormControl(5);
  mensagens = new FormControl('');

  colunaNome = new FormControl(0);
  colunaContato = new FormControl(1);

  iniciado = signal(false);
  mensagemList = signal<string[]>([]);
  selectedFile = signal<File | null>(null);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  chamarAgora(lead: Lead): void {
    if (!lead.telefone || lead.enviado) return;

    lead.enviado = true;
    this.dataSource.data = [...this.dataSource.data];

    var preLead = 'Olá ' + lead.nome;

    const whatsappUrl = `https://wa.me/${lead.telefone}?text=${encodeURIComponent(preLead + ' ' + this.mensagem.value || '')}`;
    window.open(whatsappUrl, '_blank');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async autoEnvio(): Promise<void> {
    const tempoSegundos = Number(this.intervalo.value) || 0;

    if (tempoSegundos < 5) {
      console.warn('O intervalo deve ser de no mínimo 5 segundos.');
      return;
    }

    const tempoEsperaMs = tempoSegundos * 1000;

    const leadsParaEnviar = this.dataSource.data.filter(l => {
      const telefoneLimpo = this.limparTelefone(l.telefone);
      return telefoneLimpo.length > 0 && !l.enviado;
    });

    if (!this.iniciado() && leadsParaEnviar.length > 0) {
      this.iniciado.set(true);

      for (let index = 0; index < leadsParaEnviar.length; index++) {
        if (!this.iniciado()) break;

        const lead = leadsParaEnviar[index];
        this.chamarAgora(lead);

        if (index < leadsParaEnviar.length - 1) {
          await this.delay(tempoEsperaMs);
        }
      }

      this.iniciado.set(false);
    }
  }

  private limparTelefone(telefone: string): string {
    if (!telefone) return '';

    let apenasNumeros = telefone.replace(/\D/g, '');

    if (!apenasNumeros.startsWith('55')) {
      apenasNumeros = '55' + apenasNumeros;
    }

    return apenasNumeros;
  }

  addMensagem(): void {
    const texto = this.mensagem.value?.trim();
    if (texto) {
      localStorage.setItem('msn', texto);
      this.mensagemList.update(list => [...list, texto]);
    }
  }

  onMensagemSelecionada(mensagemSelecionada: string): void {
    if (mensagemSelecionada) {
      this.mensagem.setValue(mensagemSelecionada);
    }
  }

  removerMensagem(event: Event, index: number, itemRemovido: string): void {
    event.stopPropagation();

    this.mensagemList.update(list => list.filter((_, i) => i !== index));

    if (this.mensagens.value === itemRemovido) {
      this.mensagens.setValue('');
      this.mensagem.setValue('');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);
      this.processarArquivo(file);
    }
  }

  private processarArquivo(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const conteudo = e.target?.result as string;
      if (conteudo) {
        const novosLeads = this.converterTextoParaLeads(conteudo);
        this.dataSource.data = novosLeads;
      }
    };

    reader.readAsText(file);
  }

  private converterTextoParaLeads(texto: string): Lead[] {
    const linhas = texto.split(/\r?\n/).filter(linha => linha.trim() !== '');

    if (linhas.length === 0) return [];

    const separador = linhas[0].includes(';') ? ';' : ',';
    const primeiraLinhaEhCabecalho = linhas[0].toLowerCase().includes('nome') || linhas[0].toLowerCase().includes('contato');
    const dadosLinhas = primeiraLinhaEhCabecalho ? linhas.slice(1) : linhas;

    const idxNome = this.colunaNome.value ?? 0;
    const idxContato = this.colunaContato.value ?? 1;

    return dadosLinhas.map((linha, index) => {
      const colunas = linha.split(separador).map(col => col.trim().replace(/^"|"$/g, ''));

      return {
        id: (index + 1).toString(),
        nome: colunas[idxNome] || 'Sem Nome',
        telefone: this.limparTelefone(colunas[idxContato] || ''),
        enviado: false
      };
    });
  }
  // Dispara a ligação telefônica diretamente
  ligarAgora(lead: Lead): void {
    if (!lead.telefone) return;

    // Abre o discador padrão do sistema/dispositivo
    window.location.href = `tel:${lead.telefone}`;
  }
}