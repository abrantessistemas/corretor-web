import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface Corretor {
  nome: string;
  numeroSorteado?: number;
}

@Component({
  selector: 'app-roleta-corretores',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatListModule,
    MatCardModule, MatIconModule
  ],
  templateUrl: './roleta.html',
  styleUrls: ['./roleta.scss']
})
export class RoletaCorretoresComponent {
  novoCorretor = signal('');
  listaCorretores = signal<Corretor[]>([]);
  estaGirando = signal(false);
  isExpanded = signal(false); // Controle por clique

  sortearN = signal(false);

  toggleJanela() {
    this.isExpanded.update(v => !v);
  }

  adicionarCorretor() {
    if (this.novoCorretor().trim()) {
      // Adiciona sem número e reseta a ordem dos outros para "limpar" o sorteio anterior
      const novaLista = this.listaCorretores().map(c => ({ ...c, numeroSorteado: undefined }));
      this.listaCorretores.set([...novaLista, { nome: this.novoCorretor() }]);
      this.novoCorretor.set('');
    }
  }

  excluirCorretor(index: number) {
    if (this.listaCorretores().length > 0) {
      this.listaCorretores.update(lista => lista.filter((_, i) => i !== index));
    } else {
      this.limpar();
    }
  }

  sortear() {
    if (!this.sortearN()) {
      if (this.listaCorretores().length < 2) return;
      this.estaGirando.set(true);

      setTimeout(() => {
        const total = this.listaCorretores().length;
        const numeros = Array.from({ length: total }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

        // Atribui e depois ordena a lista pelo número sorteado (Crescente)
        const resultado = this.listaCorretores()
          .map((c, i) => ({ ...c, numeroSorteado: numeros[i] }))
          .sort((a, b) => (a.numeroSorteado! - b.numeroSorteado!));

        this.listaCorretores.set(resultado);
        this.estaGirando.set(false);
        this.sortearN.set(true);
      }, 1500);
    }
  }

  limpar() {
    this.listaCorretores.set([]);
    this.sortearN.set(false);
  }
}