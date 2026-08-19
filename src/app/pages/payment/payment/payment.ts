import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AssociativeComponent } from '../associative/associative';

@Component({
  selector: 'app-payment',
  imports: [
    MatTabsModule,
    MatIconModule,
    AssociativeComponent
],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {

}
