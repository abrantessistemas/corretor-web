import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundOffer } from './outbound-offer';

describe('OutboundOffer', () => {
  let component: OutboundOffer;
  let fixture: ComponentFixture<OutboundOffer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutboundOffer],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundOffer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
