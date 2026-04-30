import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Roleta } from './roleta';

describe('Roleta', () => {
  let component: Roleta;
  let fixture: ComponentFixture<Roleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roleta],
    }).compileComponents();

    fixture = TestBed.createComponent(Roleta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
