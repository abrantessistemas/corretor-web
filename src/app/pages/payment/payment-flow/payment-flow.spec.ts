import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFlow } from './payment-flow';

describe('PaymentFlow', () => {
  let component: PaymentFlow;
  let fixture: ComponentFixture<PaymentFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFlow],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFlow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
