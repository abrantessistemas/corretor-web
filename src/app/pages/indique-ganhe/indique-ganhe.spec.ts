import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiqueGanhe } from './indique-ganhe';

describe('IndiqueGanhe', () => {
  let component: IndiqueGanhe;
  let fixture: ComponentFixture<IndiqueGanhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndiqueGanhe],
    }).compileComponents();

    fixture = TestBed.createComponent(IndiqueGanhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
