import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, merge } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PropertyService } from '../../services/property';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  projeto?: string;
  qrCode?: string;
  enviado?: boolean;
  ligacaoRealizada?: boolean;
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
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly propertyService = inject(PropertyService);
  private readonly destroy$ = new Subject<void>();

  private readonly STORAGE_MENSAGENS_KEY = 'mensagens_outbound_list';
  private readonly STORAGE_ESTADO_KEY = 'oferta_ativa_estado';

  private readonly MENSAGENS_PADRAO = this.propertyService.mensagensPadrao();

  // Signals de Interface e Estado
  readonly isMobile = signal<boolean>(false);
  readonly exibirQrCode = signal<boolean>(false);
  readonly iniciado = signal<boolean>(false);
  readonly pausado = signal<boolean>(false);
  readonly carregandoArquivo = signal<boolean>(false);
  readonly selectedFile = signal<File | null>(null);
  readonly mensagemList = signal<any[]>([]);
  readonly mensagemIndex = signal<number>(0);

  // Métrica Signals
  readonly tando = signal<number>(0);
  readonly ligacao = signal<number>(0);
  readonly de = signal<number>(0);
  readonly ultimoContato = signal<string>('');

  readonly columns: ColumnConfig[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'acoes', label: 'Ações' }
  ];
  readonly displayedColumns = this.columns.map(c => c.key);
  readonly dataSource = new MatTableDataSource<Lead>([]);

  // Form Controls
  readonly mensagem = new FormControl<string>('', { nonNullable: true });
  readonly intervalo = new FormControl<number>(5, { nonNullable: true });
  readonly mensagens = new FormControl<any>('', { nonNullable: true });
  readonly colunaNome = new FormControl<number>(1, { nonNullable: true });
  readonly colunaContato = new FormControl<number>(2, { nonNullable: true });
  readonly periodo = new FormControl<string>('Bom dia', { nonNullable: true });

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
    this.observarAlteracoesFormulario();
  }

  ngOnDestroy(): void {
    this.salvarEstadoLocalStorage();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.pageIndex = this.paginacaoSalva.pageIndex;
      this.paginator.pageSize = this.paginacaoSalva.pageSize;
      this.dataSource.paginator = this.paginator;
    }
  }

  private observarAlteracoesFormulario(): void {
    const formChanges$ = merge(
      this.mensagem.valueChanges,
      this.intervalo.valueChanges,
      this.colunaNome.valueChanges,
      this.colunaContato.valueChanges,
      this.periodo.valueChanges
    );

    formChanges$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.exibirQrCode()) {
          this.atualizarQrCodesVisiveis();
        }
        this.salvarEstadoLocalStorage();
      });
  }

  onPageChange(event: PageEvent): void {
    this.paginacaoSalva = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    };
    if (this.exibirQrCode()) {
      this.atualizarQrCodesVisiveis();
    }
    this.salvarEstadoLocalStorage();
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
    this.tando.set(0);
    this.ultimoContato.set('');
    this.carregandoArquivo.set(true);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const conteudo = e.target?.result as string;
        if (conteudo) {
          const novosLeads = await this.converterTextoParaLeads(conteudo);
          this.dataSource.data = novosLeads;
          this.de.set(novosLeads.length);

          if (this.paginator) {
            this.paginator.firstPage();
            this.paginacaoSalva.pageIndex = 0;
          }

          if (this.exibirQrCode()) {
            await this.atualizarQrCodesVisiveis();
          }

          this.salvarEstadoLocalStorage();
        }
      } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
      } finally {
        this.carregandoArquivo.set(false);
      }
    };

    reader.onerror = () => {
      console.error('Erro ao ler o arquivo.');
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
        leads.push({
          id: leadId.toString(),
          nome,
          telefone,
          enviado: false
        });
        leadId++;
      }
    }

    return leads;
  }

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

  chamarAgora(lead: Lead, auto: boolean): void {
    if (!lead.telefone || lead.enviado) return;

    let mensagemAtual = this.mensagem.value || '';

    if (auto) {
      const lista = this.mensagemList();
      if (lista.length > 0) {
        const idx = this.mensagemIndex();
        mensagemAtual = lista[idx].mensagem || lista[idx] || '';
        this.mensagemIndex.set((idx + 1) % lista.length);
      }
    }

    lead.enviado = true;
    this.dataSource.data = [...this.dataSource.data];

    const textoFormatado = `${this.periodo.value} ${lead.nome} ${mensagemAtual}`.trim();
    const whatsappUrl = `https://wa.me/${lead.telefone}?text=${encodeURIComponent(textoFormatado)}`;

    window.open(whatsappUrl, '_blank');

    this.ultimoContato.set(lead.nome);
    this.tando.set(this.tando() + 1);
    this.salvarEstadoLocalStorage();
  }

  ligarAgora(lead: Lead): void {
    if (!lead.telefone) return;
    const numeroLimpo = lead.telefone.startsWith('55') ? lead.telefone.substring(2) : lead.telefone;
    window.location.href = `tel:0${numeroLimpo}`;
    this.ligacao.set(this.ligacao() + 1);
    lead.ligacaoRealizada = true;
    this.salvarEstadoLocalStorage();
  }

  // --- CONTROLES DE AUTOMAÇÃO (PLAYER AUTO PLAY CORRIGIDO) ---

  async play(): Promise<void> {
    const tempoSegundos = Number(this.intervalo.value) || 0;
    if (tempoSegundos < 5) return;

    this.pausado.set(false);
    if (this.iniciado()) return;

    this.iniciado.set(true);

    while (this.iniciado()) {
      if (this.pausado()) {
        await this.delay(1000);
        continue;
      }

      const proximoLead = this.dataSource.data.find(l => {
        const tel = this.limparTelefone(l.telefone);
        return tel.length > 0 && !l.enviado;
      });

      if (!proximoLead) {
        this.iniciado.set(false);
        break;
      }

      this.chamarAgora(proximoLead, true);
      await this.delay(tempoSegundos * 1000);
    }
  }

  pause(): void {
    this.pausado.set(true);
  }

  stop(): void {
    this.iniciado.set(false);
    this.pausado.set(false);
  }

  voltarUm(): void {
    const listaInvertida = [...this.dataSource.data].reverse();
    const ultimoEnviado = listaInvertida.find(l => l.enviado);
    if (ultimoEnviado) {
      ultimoEnviado.enviado = false;
      this.dataSource.data = [...this.dataSource.data];
      this.tando.update(v => Math.max(0, v - 1));
      this.salvarEstadoLocalStorage();
    }
  }

  voltarTodos(): void {
    this.stop();
    this.dataSource.data.forEach(l => (l.enviado = false));
    this.dataSource.data = [...this.dataSource.data];
    this.tando.set(0);
    this.ultimoContato.set('');
    this.salvarEstadoLocalStorage();
  }

  // Corrigido: Avança o contato executando o envio do WhatsApp real
  avancarUm(): void {
    const proximoLead = this.dataSource.data.find(l => !l.enviado && this.limparTelefone(l.telefone).length > 0);
    if (proximoLead) {
      this.chamarAgora(proximoLead, true);
    }
  }

  avancarTodos(): void {
    this.stop();
    this.dataSource.data.forEach(l => {
      if (!l.enviado && this.limparTelefone(l.telefone).length > 0) {
        l.enviado = true;
      }
    });
    this.dataSource.data = [...this.dataSource.data];
    this.tando.set(this.dataSource.data.filter(l => l.enviado).length);
    this.salvarEstadoLocalStorage();
  }

  // --- OTIMIZAÇÃO E GERADOR DE QR CODE ---

  async toggleQrCode() {
    this.exibirQrCode.update(v => !v);
    if (this.exibirQrCode()) {
      await this.atualizarQrCodesVisiveis();
    }
    this.salvarEstadoLocalStorage();
  }

  private async atualizarQrCodesVisiveis(): Promise<void> {
    if (!this.paginator) return;

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    const leadsPagina = this.dataSource.data.slice(startIndex, endIndex);

    for (const lead of leadsPagina) {
      if (!lead.qrCode && lead.telefone) {
        lead.qrCode = await this.gerarQrCodeWhatsApp(lead.nome, lead.telefone);
      }
    }
    this.dataSource.data = [...this.dataSource.data];
  }

  private async gerarQrCodeWhatsApp(nome: string, telefone: string): Promise<string> {
    if (!telefone) return '';
    const textoMensagem = `${this.periodo.value} ${nome} ${this.mensagem.value || ''}`.trim();
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(textoMensagem)}`;

    try {
      const QRCodeModule = await import('qrcode');
      return await QRCodeModule.toDataURL(whatsappUrl, { width: 220, margin: 1 });
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      return '';
    }
  }

  private salvarEstadoLocalStorage(): void {
    const leadsSanitizados = this.dataSource.data.map(({ id, nome, telefone, enviado, ligacaoRealizada }) => ({
      id,
      nome,
      telefone,
      enviado,
      ligacaoRealizada
    }));

    const estado = {
      leads: leadsSanitizados,
      mensagem: this.mensagem.value,
      intervalo: this.intervalo.value,
      colunaNome: this.colunaNome.value,
      colunaContato: this.colunaContato.value,
      mensagemList: this.mensagemList(),
      periodo: this.periodo.value,
      paginacao: this.paginacaoSalva,
      exibirQrCode: this.exibirQrCode(),
      tando: this.tando(),
      ligacao: this.ligacao(),
      de: this.de(),
      ultimoContato: this.ultimoContato(),
      mensagemIndex: this.mensagemIndex()
    };

    try {
      localStorage.setItem(this.STORAGE_ESTADO_KEY, JSON.stringify(estado));
    } catch (e) {
      console.warn('Não foi possível gravar no LocalStorage:', e);
    }
  }

  private carregarEstadoLocalStorage(): void {
    const dadosSalvos = localStorage.getItem(this.STORAGE_ESTADO_KEY);
    if (!dadosSalvos) return;

    try {
      const estado = JSON.parse(dadosSalvos);
      if (estado.leads) this.dataSource.data = estado.leads;
      if (estado.mensagem) this.mensagem.setValue(estado.mensagem, { emitEvent: false });
      if (estado.intervalo) this.intervalo.setValue(estado.intervalo, { emitEvent: false });
      if (estado.colunaNome !== undefined) this.colunaNome.setValue(estado.colunaNome, { emitEvent: false });
      if (estado.colunaContato !== undefined) this.colunaContato.setValue(estado.colunaContato, { emitEvent: false });
      if (estado.periodo !== undefined) this.periodo.setValue(estado.periodo, { emitEvent: false });
      if (estado.mensagemList) this.mensagemList.set(estado.mensagemList);
      if (estado.paginacao) this.paginacaoSalva = estado.paginacao;
      if (estado.exibirQrCode !== undefined) this.exibirQrCode.set(estado.exibirQrCode);
      if (estado.tando !== undefined) this.tando.set(estado.tando);
      if (estado.ligacao !== undefined) this.ligacao.set(estado.ligacao);
      if (estado.de !== undefined) this.de.set(estado.de);
      if (estado.ultimoContato !== undefined) this.ultimoContato.set(estado.ultimoContato);
      if (estado.mensagemIndex !== undefined) this.mensagemIndex.set(estado.mensagemIndex);
    } catch (e) {
      console.error('Erro ao restaurar estado do aplicativo:', e);
    }
  }

  limparEstado(): void {
    localStorage.removeItem(this.STORAGE_ESTADO_KEY);
    this.dataSource.data = [];
    this.selectedFile.set(null);
    this.tando.set(0);
    this.ligacao.set(0);
    this.de.set(0);
    this.ultimoContato.set('');
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
    const texto = this.mensagem.value;
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
      this.mensagens.setValue('', { emitEvent: false });
      this.mensagem.setValue('', { emitEvent: false });
    }
  }

  onMensagemSelecionada(mensagemSelecionada: any): void {
    if (mensagemSelecionada) {
      const texto = typeof mensagemSelecionada === 'string' ? mensagemSelecionada : mensagemSelecionada.mensagem;
      this.mensagem.setValue(texto || '');
    }
  }

  private limparTelefone(telefone: string): string {
    if (!telefone) return '';
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (!apenasNumeros) return '';
    return apenasNumeros.startsWith('55') ? apenasNumeros : '55' + apenasNumeros;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  cortaTexto(texto: string): string {
    if (!texto) return '';
    const indexEspaco = texto.indexOf(' ');
    if (indexEspaco === -1) return texto;
    return texto.substring(0, indexEspaco + 4);
  }
}