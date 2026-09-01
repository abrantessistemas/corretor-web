import {
  Component,
  inject,
  signal,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
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
import * as QRCode from 'qrcode';

import { PropertyService } from '../../services/property';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  projeto?: string;
  qrCode?: string;
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
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './outbound-offer.html',
  styleUrl: './outbound-offer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundOffer implements OnInit, OnDestroy, AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  // Signal para indicar se o dispositivo atual é Mobile
  isMobile = signal<boolean>(false);

  public readonly propertyService = inject(PropertyService);

  private readonly STORAGE_MENSAGENS_KEY = 'mensagens_outbound_list';
  private readonly STORAGE_ESTADO_KEY = 'oferta_ativa_estado';

  private readonly MENSAGENS_PADRAO: string[] = [
    'temos novidades especiais para você.',
    'temos condições especiais de pagamento este mês.',
    'venha conferir o feirão de imoveis da caixa neste final de semana.'
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
  colunaNome = new FormControl(1);
  colunaContato = new FormControl(2);
  periodo = new FormControl('Bom dia');

  // State Signals
  iniciado = signal(false);
  carregandoArquivo = signal(false);
  selectedFile = signal<File | null>(null);
  mensagemList = signal<string[]>([]);

  // Estado da Paginacao recuperado
  private paginacaoSalva: EstadoPaginacao = { pageIndex: 0, pageSize: 5 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (this.isMobile()) {
          this.exibirQrCode.set(false);
        }
      });

    this.carregarMensagens();
    this.carregarEstadoLocalStorage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
          // Exemplo alternativo com .then() se o contexto não for async:
          this.converterTextoParaLeads(conteudo).then(novosLeads => {
            this.dataSource.data = novosLeads;
          });
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

  private async converterTextoParaLeads(texto: string): Promise<Lead[]> {
    const linhasBrutas = texto.split(/\r\n|\n|\r/);
    if (linhasBrutas.length === 0) return [];

    const primeiraLinhaValida = linhasBrutas.find(l => l.trim().length > 0) || '';
    const separador = primeiraLinhaValida.includes(';') ? ';' : ',';

    const idxNome = (this.colunaNome.value ?? 1) - 1;
    const idxContato = (this.colunaContato.value ?? 2) - 1;

    const leads: Lead[] = [];
    let leadId = 1;

    for (let index = 0; index < linhasBrutas.length; index++) {
      const linha = linhasBrutas[index].trim();
      if (!linha) continue;

      const colunas = this.parseCSVLine(linha, separador);
      const primeiraColuna = (colunas[idxNome] || '').toLowerCase();
      const segundaColuna = (colunas[idxContato] || '').toLowerCase();

      if (index === 0 && (primeiraColuna.includes('nome') || segundaColuna.includes('contato') || segundaColuna.includes('telefone'))) {
        continue;
      }

      const nome = colunas[idxNome] ? colunas[idxNome].trim() : 'Sem Nome';
      const telefone = this.limparTelefone(colunas[idxContato] || '');

      if (nome !== 'Sem Nome' || telefone.length > 2) {
        // Gera o QR Code individual apontando para o WhatsApp com a mensagem
        const qrCodeBase64 = await this.gerarQrCodeWhatsApp(nome, telefone);

        leads.push({
          id: leadId.toString(),
          nome: nome,
          telefone: telefone,
          qrCode: qrCodeBase64,
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

    const textoFormatado = `${this.periodo.value} ${lead.nome} ${this.mensagem.value || ''}`.trim();
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

    var totalLeads = leadsParaEnviar.length;

    if (this.iniciado()) {
      this.iniciado.set(false);
      totalLeads = 0;
    }

    if (!this.iniciado() && leadsParaEnviar.length > 0) {
      this.iniciado.set(true);

      for (let index = 0; index < totalLeads; index++) {
        if (!this.iniciado()) break;

        this.chamarAgora(leadsParaEnviar[index]);

        if (index < leadsParaEnviar.length - 1) {
          await this.delay(tempoSegundos * 1000);
        }
      }

      this.iniciado.set(false);
    }
  }

  desligar() {
    this.iniciado.set(false);
  }
  // --- Persistência em LocalStorage ---

  private salvarEstadoLocalStorage(): void {
    // if (!isPlatformBrowser(this.platformId)) return;

    const estado = {
      leads: this.dataSource.data,
      mensagem: this.mensagem.value,
      intervalo: this.intervalo.value,
      colunaNome: this.colunaNome.value,
      colunaContato: this.colunaContato.value,
      mensagemList: this.mensagemList(),
      paginacao: this.paginacaoSalva,
      exibirQrCode: this.exibirQrCode() // <--- Salva a preferência
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
  // Método auxiliar para criar a imagem do QR Code com Link do WhatsApp
  async gerarQrCodeWhatsApp(nome: string, telefone: string): Promise<string> {
    if (!telefone) return '';

    const textoMensagem = `Olá ${nome} ${this.mensagem.value || ''}`.trim();
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(textoMensagem)}`;

    try {
      return await QRCode.toDataURL(whatsappUrl, { width: 100, margin: 1 });
    } catch (err) {
      console.error('Erro ao gerar QR Code para o lead:', err);
      return '';
    }
  }

  // Signal para controlar a exibição do QR Code
  exibirQrCode = signal<boolean>(true);

  // Alterne o valor do QR Code
  toggleQrCode(): void {
    this.exibirQrCode.update(v => !v);
    this.salvarEstadoLocalStorage();
  }
}