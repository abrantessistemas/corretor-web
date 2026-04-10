import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AssociativeComponent } from '../associative/associative';
import { InvestorComponent } from '../investor/investor';
import { DirectComponent } from '../direct/direct';

@Component({
  selector: 'app-payment',
  imports: [
    MatTabsModule,
    MatIconModule,
    AssociativeComponent,
    DirectComponent,
    InvestorComponent
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {

}
