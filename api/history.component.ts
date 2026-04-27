import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({ ... })
export class HistoryComponent {
  constructor(private http: HttpClient) {}

  enviarFormulario(dados: any) {
    this.http.post('/api/historico', dados).subscribe({
      next: (res) => console.log('Dados salvos com sucesso!', res),
      error: (err) => console.error('Erro ao salvar', err)
    });
  }
}