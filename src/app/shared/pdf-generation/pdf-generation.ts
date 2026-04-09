import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'pdf-generation',
  templateUrl: './pdf-generation.html',
  styleUrls: ['./pdf-generation.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatDialogActions,
    CurrencyPipe,
    DatePipe,
    PercentPipe
  ]
})
export class PdfGenerationComponent implements OnInit {
  dataCriacao = new Date();
  form: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<PdfGenerationComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.defaults;
  }

  get percentualFinanciamento() {
    return this.form.valorFinanciamento / this.form.valorVenda;
  }

  printer() {
    const printContent = document.getElementById('printable-area');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');

    if (WindowPrt && printContent) {
      WindowPrt.document.write(`
        <html>
          <head>
            <title>Proposta do cliente: ${this.form.nomeCliente}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
              .header { border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
              .section { margin-bottom: 20px; border: 1px solid #eee; padding: 15px; border-radius: 8px; }
              .section-title { font-weight: bold; color: #2c3e50; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #eee; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .label { color: #666; font-size: 12px; }
              .value { font-weight: 600; font-size: 14px; }
              .highlight { background: #f8f9fa; padding: 10px; border-left: 4px solid #27ae60; }
              .footer { margin-top: 30px; font-size: 10px; text-align: center; color: #999; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
        WindowPrt.close();
      }, 250);
    }
    this.dialogRef.close();
  }
  fechar() {
    this.dialogRef.close();
  }
}