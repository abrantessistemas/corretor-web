import {
  Component,
  inject,
  signal,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

interface EstadoPaginacao {
  pageIndex: number;
  pageSize: number;
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
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './outbound-offer.html',
  styleUrl: './outbound-offer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundOffer implements OnInit, AfterViewInit {
  public readonly propertyService = inject(PropertyService);

  private readonly STORAGE_MENSAGENS_KEY = 'mensagens_outbound_list';
  private readonly STORAGE_ESTADO_KEY = 'oferta_ativa_estado';

  private readonly MENSAGENS_PADRAO: string[] = [
    'Olá! Gostaria de obter mais informações sobre o imóvel.',
    'Oi! Temos condições especiais de pagamento este mês.',
    'Olá! Gostaria de agendar uma visita ao decorado?'
  ];

  readonly columns: ColumnConfig[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'acoes', label: 'Ações' }
  ];
  readonly displayedColumns = this.columns.map(c => c.key);
  readonly dataSource = new MatTableDataSource<Lead>([]);

  // Controls
  mensagem = new FormControl('Olá');
  intervalo = new FormControl(5);
  mensagens = new FormControl('');
  colunaNome = new FormControl(0);
  colunaContato = new FormControl(1);

  // State Signals
  iniciado = signal(false);
  carregandoArquivo = signal(false);
  selectedFile = signal<File | null>(null);
  mensagemList = signal<string[]>([]);

  // Estado da Paginacao recuperado
  private paginacaoSalva: EstadoPaginacao = { pageIndex: 0, pageSize: 5 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.carregarMensagens();
    this.carregarEstadoLocalStorage();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    // Aplica o estado salvo da paginação no MatPaginator após a renderização
    if (this.paginator) {
      this.paginator.pageIndex = this.paginacaoSalva.pageIndex;
      this.paginator.pageSize = this.paginacaoSalva.pageSize;
      this.dataSource.paginator = this.paginator;
    }
  }

  // --- Salvar Paginação ao Mudar de Página ---
  onPageChange(event: PageEvent): void {
    this.paginacaoSalva = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    };
    this.salvarEstadoLocalStorage();
  }

  // --- Processamento de CSV / Texto Robusto ---

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);
      this.processarArquivo(file);
    }
  }

  private processarArquivo(file: File): void {
    this.carregandoArquivo.set(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const conteudo = e.target?.result as string;
        if (conteudo) {
          const novosLeads = this.converterTextoParaLeads(conteudo);
          this.dataSource.data = novosLeads;

          // Reset da paginação para a primeira página ao carregar novo arquivo
          if (this.paginator) {
            this.paginator.firstPage();
            this.paginacaoSalva.pageIndex = 0;
          }

          this.salvarEstadoLocalStorage();
        }
      } catch (error) {
        console.error('Erro ao ler o arquivo selecionado:', error);
      } finally {
        this.carregandoArquivo.set(false);
      }
    };

    reader.onerror = () => {
      console.error('Erro ao carregar o arquivo.');
      this.carregandoArquivo.set(false);
    };

    reader.readAsText(file, 'UTF-8');
  }

  private converterTextoParaLeads(texto: string): Lead[] {
    // Normaliza quebras de linha
    const linhasBrutas = texto.split(/\r\n|\n|\r/);
    if (linhasBrutas.length === 0) return [];

    // Descobre o separador baseado na primeira linha não vazia
    const primeiraLinhaValida = linhasBrutas.find(l => l.trim().length > 0) || '';
    const separador = primeiraLinhaValida.includes(';') ? ';' : ',';

    const idxNome = this.colunaNome.value ?? 0;
    const idxContato = this.colunaContato.value ?? 1;

    const leads: Lead[] = [];
    let leadId = 1;

    for (let index = 0; index < linhasBrutas.length; index++) {
      const linha = linhasBrutas[index].trim();

      // Ignora linhas totalmente vazias
      if (!linha) continue;

      const colunas = this.parseCSVLine(linha, separador);

      // Detecta e pula cabeçalhos
      const primeiraColuna = (colunas[idxNome] || '').toLowerCase();
      const segundaColuna = (colunas[idxContato] || '').toLowerCase();

      if (index === 0 && (primeiraColuna.includes('nome') || segundaColuna.includes('contato') || segundaColuna.includes('telefone'))) {
        continue;
      }

      const nome = colunas[idxNome] ? colunas[idxNome].trim() : 'Sem Nome';
      const telefoneBruto = colunas[idxContato] ? colunas[idxContato].trim() : '';
      const telefone = this.limparTelefone(telefoneBruto);

      // Garante que só adiciona se tiver ao menos nome ou telefone preenchidos
      if (nome !== 'Sem Nome' || telefone.length > 2) {
        leads.push({
          id: leadId.toString(),
          nome: nome,
          telefone: telefone,
          enviado: false
        });
        leadId++;
      }
    }

    return leads;
  }

  // Realiza o parse respeitando aspas internas no CSV
  private parseCSVLine(line: string, separator: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === separator && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  }

  // --- Ações Principais ---

  chamarAgora(lead: Lead): void {
    if (!lead.telefone || lead.enviado) return;

    lead.enviado = true;
    this.dataSource.data = [...this.dataSource.data];
    this.salvarEstadoLocalStorage();

    const textoFormatado = `Olá ${lead.nome} ${this.mensagem.value || ''}`.trim();
    const whatsappUrl = `https://wa.me/${lead.telefone}?text=${encodeURIComponent(textoFormatado)}`;
    window.open(whatsappUrl, '_blank');
  }

  ligarAgora(lead: Lead): void {
    if (!lead.telefone) return;
    const numeroLimpo = lead.telefone.startsWith('55') ? lead.telefone.substring(2) : lead.telefone;
    window.location.href = `tel:0${numeroLimpo}`;
  }

  async autoEnvio(): Promise<void> {
    const tempoSegundos = Number(this.intervalo.value) || 0;
    if (tempoSegundos < 5) return;

    const leadsParaEnviar = this.dataSource.data.filter(l => {
      const tel = this.limparTelefone(l.telefone);
      return tel.length > 0 && !l.enviado;
    });

    if (!this.iniciado() && leadsParaEnviar.length > 0) {
      this.iniciado.set(true);

      for (let index = 0; index < leadsParaEnviar.length; index++) {
        if (!this.iniciado()) break;

        this.chamarAgora(leadsParaEnviar[index]);

        if (index < leadsParaEnviar.length - 1) {
          await this.delay(tempoSegundos * 1000);
        }
      }

      this.iniciado.set(false);
    }
  }

  // --- Persistência em LocalStorage ---

  private salvarEstadoLocalStorage(): void {
    const estado = {
      leads: this.dataSource.data,
      mensagem: this.mensagem.value,
      intervalo: this.intervalo.value,
      colunaNome: this.colunaNome.value,
      colunaContato: this.colunaContato.value,
      mensagemList: this.mensagemList(),
      paginacao: this.paginacaoSalva
    };

    localStorage.setItem(this.STORAGE_ESTADO_KEY, JSON.stringify(estado));
  }

  private carregarEstadoLocalStorage(): void {
    const dadosSalvos = localStorage.getItem(this.STORAGE_ESTADO_KEY);
    if (!dadosSalvos) return;

    try {
      const estado = JSON.parse(dadosSalvos);
      if (estado.leads) this.dataSource.data = estado.leads;
      if (estado.mensagem) this.mensagem.setValue(estado.mensagem);
      if (estado.intervalo) this.intervalo.setValue(estado.intervalo);
      if (estado.colunaNome !== undefined) this.colunaNome.setValue(estado.colunaNome);
      if (estado.colunaContato !== undefined) this.colunaContato.setValue(estado.colunaContato);
      if (estado.mensagemList) this.mensagemList.set(estado.mensagemList);
      if (estado.paginacao) this.paginacaoSalva = estado.paginacao;
    } catch (e) {
      console.error('Erro ao restaurar estado do aplicativo:', e);
    }
  }

  limparEstado(): void {
    localStorage.removeItem(this.STORAGE_ESTADO_KEY);
    this.dataSource.data = [];
    this.selectedFile.set(null);
  }

  private carregarMensagens(): void {
    const dadosSalvos = localStorage.getItem(this.STORAGE_MENSAGENS_KEY);
    if (dadosSalvos) {
      try {
        this.mensagemList.set(JSON.parse(dadosSalvos));
      } catch {
        this.mensagemList.set([...this.MENSAGENS_PADRAO]);
      }
    } else {
      this.mensagemList.set([...this.MENSAGENS_PADRAO]);
      this.salvarMensagens();
    }
  }

  private salvarMensagens(): void {
    localStorage.setItem(this.STORAGE_MENSAGENS_KEY, JSON.stringify(this.mensagemList()));
  }

  adicionarMensagem(): void {
    const texto = this.mensagem.value?.trim();
    if (!texto) return;

    this.mensagemList.update(list => [...list, texto]);
    this.salvarMensagens();
    this.salvarEstadoLocalStorage();
  }

  removerMensagem(event: Event, index: number, itemRemovido: string): void {
    event.stopPropagation();
    this.mensagemList.update(list => list.filter((_, i) => i !== index));
    this.salvarMensagens();

    if (this.mensagens.value === itemRemovido) {
      this.mensagens.setValue('');
      this.mensagem.setValue('');
    }
  }

  onMensagemSelecionada(mensagemSelecionada: string): void {
    if (mensagemSelecionada) {
      this.mensagem.setValue(mensagemSelecionada);
    }
  }

  private limparTelefone(telefone: string): string {
    if (!telefone) return '';
    let apenasNumeros = telefone.replace(/\D/g, '');
    if (!apenasNumeros) return '';
    return apenasNumeros.startsWith('55') ? apenasNumeros : '55' + apenasNumeros;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}