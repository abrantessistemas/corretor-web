import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySlide } from './property-slide';

describe('PropertySlide', () => {
  let component: PropertySlide;
  let fixture: ComponentFixture<PropertySlide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySlide],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertySlide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
