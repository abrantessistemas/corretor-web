import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property';
import { disabled } from '@angular/forms/signals';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: number;
  title: string;
  price: string;
  price_promo: string;
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
  public propertyService = inject(PropertyService);

  // Estado dos planos usando Angular Signals
  plans = signal<PricingPlan[]>([
    {
      id: 1,
      title: 'Plano Mensal',
      price: 'R$ 1900,00',
      price_promo: 'R$ 960,00',
      subtitle: 'por mês',
      dailyPrice: 'Apenas R$ 32,00 por dia',
      highlight: 'Evolução constante do sistema',
      isPopular: true,
      type: 'mensal',
      buttonText: 'ASSINAR AGORA',
      features: [
        { text: 'Com os 10 melhores Riva da sua preferência cadastrados.', included: true },
        { text: 'Botão do whatsapp para contato direto do lead.', included: true },
        { text: 'Atualização de lançamentos Riva automatica.', included: true },
        { text: 'Ajustes e correções de bugs', included: true },
        { text: 'Atualizações e melhorias gerais constantes.', included: true },
        { text: 'Hospedagem por 1 ano inclusa.', included: true }
      ]
    },
    {
      id: 2,
      title: 'Plano Aquisição',
      price: 'R$ 800,00',
      price_promo: '',
      subtitle: 'Pagamento Único',
      highlight: 'Sempre ultimo modelo disponível',
      isPopular: false,
      type: 'aquisicao',
      buttonText: 'SOLICITAR AQUISIÇÃO',
      features: [
        { text: 'Com os 10 melhores Riva da sua preferência cadastrados.', included: true },
        { text: 'Botão do whatsapp para contato direto do lead.', included: true },
        { text: 'Atualização de lançamentos Riva automatica.', included: false },
        { text: 'Ajustes e correções de bugs', included: false },
        { text: 'Atualizações e melhorias gerais constantes.', included: false },
        { text: 'Hospedagem por 1 ano inclusa.', included: true }
      ]
    },
    {
      id: 3,
      title: 'Plano Turbo',
      price: 'R$ 100,00',
      price_promo: '',
      subtitle: 'Pagamento por campanha',
      highlight: 'Evolução constante do sistema',
      isPopular: false,
      type: 'aquisicao',
      buttonText: 'ATIVAR CAMPANHA',
      features: [
        { text: 'Com os 10 melhores Riva da sua preferência cadastrados.', included: true },
        { text: 'Botão do whatsapp para contato direto do lead.', included: true },
        { text: 'Atualização de lançamentos Riva automatica.', included: false },
        { text: 'Ajustes e correções de bugs', included: false },
        { text: 'Atualizações e melhorias gerais constantes.', included: false },
        { text: 'Hospedagem por 1 ano inclusa.', included: false }
      ]
    }
  ]);

  whatsappMensagem =
    {
      'url': `https://wa.me/${this.propertyService.settings().whatsappConfig.whatsappNumber}?text=`,
      'mensagem': this.propertyService.settings().whatsappConfig.whatsappMessage || 'Olá! Gostaria de obter mais informações'
    };

  planSelected!: PricingPlan;

  onSelectPlan(plan: PricingPlan) {
    plan.isPopular = true;
    this.planSelected = plan;
    this.plans.update(plans => plans.map(p => p.id !== plan.id ? { ...p, isPopular: !plan.isPopular } : p));
  }

  escolher() {
    const whatsappUrl = `https://wa.me/${this.propertyService.settings().whatsappConfig.whatsappNumber}?text=${encodeURIComponent(JSON.stringify(this.planSelected))}`;
    window.open(whatsappUrl, '_blank');
    console.log(this.whatsappMensagem.url + JSON.stringify(this.planSelected), '_blank');
  }
}