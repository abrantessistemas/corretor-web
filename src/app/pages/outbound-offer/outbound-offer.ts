import { Component, inject, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { PropertyService } from '../../services/property';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from '@angular/material/select';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  projeto?: string;
  enviado?: boolean; // Marca o estado de envio
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
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './outbound-offer.html',
  styleUrl: './outbound-offer.scss',
})
export class OutboundOffer implements AfterViewInit {
  readonly columns: ColumnConfig[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'acoes', label: 'Chamar' }
  ];

  readonly displayedColumns = this.columns.map(c => c.key);
  public propertyService = inject(PropertyService);

  readonly dataSource = new MatTableDataSource<Lead>([]);

  mensagem = new FormControl('Olá');
  intervalo = new FormControl(5);
  iniciado = false;
  mensagens = new FormControl('');

  mensagemList: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Marca o lead individualmente como enviado
  chamarAgora(lead: Lead) {
    if (!lead.telefone.length || lead.enviado) return;

    lead.enviado = true; // Desabilita o botão e muda o estilo

    const whatsappUrl = `https://wa.me/${lead.telefone}?text=${encodeURIComponent(this.mensagem.value || '')}`;
    window.open(whatsappUrl, '_blank');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async autoEnvio() {
    const tempoSegundos = Number(this.intervalo.value) || 0;

    if (tempoSegundos <= 4) {
      console.warn('O intervalo deve ser superior a 4 segundos.');
      return;
    }

    const tempoEsperaMs = tempoSegundos * 1000;
    // Filtra limpando o telefone e checando se sobrou um número válido
    const leadsParaEnviar = this.dataSource.data.filter(l => {
      const telefoneLimpo = this.limparTelefone(l.telefone);
      return telefoneLimpo.length > 0 && !l.enviado;
    });

    if (!this.iniciado) {
      this.iniciado = true;

      for (let index = 0; index < leadsParaEnviar.length; index++) {
        const lead = leadsParaEnviar[index];

        // Dispara o whatsapp e atualiza o estado visual
        this.chamarAgora(lead);

        if (index < leadsParaEnviar.length - 1) {
          await this.delay(tempoEsperaMs);
        }
      }
    }
    console.log('Disparos em massa concluídos!');
    this.iniciado = false;
  }

  // Helper para limpar e formatar o telefone
  private limparTelefone(telefone: string): string {
    if (!telefone) return '';

    // 1. Remove qualquer caractere que NÃO seja número (espaços, parênteses, hífens, sinal +)
    let apenasNumeros = telefone.replace(/\D/g, '');

    // 2. Remove o prefixo 55 do início (se existir)
    if (apenasNumeros.startsWith('55')) {
      apenasNumeros = apenasNumeros.substring(2);
    }

    return apenasNumeros;
  }

  addMensagem() {
    this.mensagemList.push(this.mensagem.value || '');
  }

  onMensagemSelecionada(mensagemSelecionada: string) {
    if (mensagemSelecionada) {
      this.mensagem.setValue(mensagemSelecionada);
    }
  }

  removerMensagem(event: Event, index: number, itemRemovido: string) {
    // Impede que o clique no botão selecione a opção no mat-select
    event.stopPropagation();

    // Remove o item do array
    this.mensagemList.splice(index, 1);

    // Se a mensagem excluída era a que estava selecionada no momento, limpa o select e o textarea
    if (this.mensagens.value === itemRemovido) {
      this.mensagens.setValue('');
      this.mensagem.setValue('');
    }
  }
  selectedFile: File | null = null;
  // Manipula a seleção do arquivo
  onFileSelected(event: Event): void {
    this.dataSource.data = [];
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.processarArquivo(this.selectedFile);
    }
  }

  // Lê o arquivo e converte para Lead[]
  private processarArquivo(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const conteudo = e.target?.result as string;
      if (conteudo) {
        const novosLeads = this.converterTextoParaLeads(conteudo);

        // Atualiza a fonte de dados da MatTable
        this.dataSource.data = [...this.dataSource.data, ...novosLeads];
      }
    };

    reader.readAsText(file);
  }

  colunaNome = new FormControl(0);
  colunaContato = new FormControl(1);

  // Converte o texto no formato CSV/delimitado para o tipo Lead[]
  private converterTextoParaLeads(texto: string): Lead[] {
    const linhas = texto.split(/\r?\n/).filter(linha => linha.trim() !== '');

    if (linhas.length === 0) return [];

    // Descobre o separador (vírgula ou ponto e vírgula)
    const separador = linhas[0].includes(';') ? ';' : ',';

    // Mapeamento assumindo a ordem: id, nome, telefone, projeto, enviado
    // Ignora a primeira linha se for cabeçalho (ex: contiver "nome" ou "id")
    const primeiraLinhaEhCabecalho = linhas[0].toLowerCase().includes('nome');
    const dadosLinhas = primeiraLinhaEhCabecalho ? linhas.slice(1) : linhas;

    return dadosLinhas.map((linha, index) => {
      const colunas = linha.split(separador).map(col => col.trim().replace(/^"|"$/g, ''));

      return {
        id: colunas[0] || (this.dataSource.data.length + index + 1).toString(),
        nome: colunas[this.colunaNome.value || 0] || 'Sem Nome',
        telefone: this.limparTelefone(colunas[this.colunaContato.value || 1] || ''),
        projeto: colunas[3] || undefined,
        enviado: colunas[4] !== undefined ? colunas[4].toLowerCase() === 'true' : false
      };
    });
  }
}