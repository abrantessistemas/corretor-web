import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  title: string;
  price: string;
  subtitle?: string;
  dailyPrice?: string;
  highlight?: string;
  features: PlanFeature[];
  buttonText: string;
  isPopular: boolean;
  type: 'mensal' | 'aquisicao';
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './planos.html',
  styleUrls: ['./planos.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanosComponent {
  // Estado dos planos usando Angular Signals
  plans = signal<PricingPlan[]>([
    {
      title: 'Plano Mensal',
      price: 'R$ 500,00',
      subtitle: 'por mês',
      dailyPrice: 'Apenas R$ 16,00 por dia',
      highlight: '8 Projetos Riva Inclusos',
      isPopular: true,
      type: 'mensal',
      buttonText: 'ASSINAR AGORA',
      features: [
        { text: 'Até 3 atualizações mensais', included: true },
        { text: 'Cadastro de novos produtos', included: true },
        { text: 'Ajustes e correções de bugs', included: true },
        { text: 'Atualizações e melhorias gerais', included: true },
        { text: 'Hospedagem inclusa', included: true }
      ]
    },
    {
      title: 'Plano Aquisição',
      price: 'R$ 800,00',
      subtitle: 'Pagamento Único',
      highlight: 'Modelo de Parceria 15/85',
      isPopular: false,
      type: 'aquisicao',
      buttonText: 'SOLICITAR AQUISIÇÃO',
      features: [
        { text: '15/85 sobre comissão de venda', included: true },
        { text: 'Premiação de venda 100% livre', included: true },
        { text: 'Cadastro de novos produtos', included: true },
        { text: 'Ajustes e correções inclusas', included: true },
        { text: 'Atualizações extras: R$ 100/h', included: true },
        { text: 'Melhorias gerais inclusas', included: true }
      ]
    }
  ]);

  onSelectPlan(plan: PricingPlan) {
    console.log('Plano selecionado:', plan.title);
    // Integração com checkout ou chat aqui
  }
}