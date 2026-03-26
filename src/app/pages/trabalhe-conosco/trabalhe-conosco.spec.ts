import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabalheConosco } from './trabalhe-conosco';

describe('TrabalheConosco', () => {
  let component: TrabalheConosco;
  let fixture: ComponentFixture<TrabalheConosco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrabalheConosco],
    }).compileComponents();

    fixture = TestBed.createComponent(TrabalheConosco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
