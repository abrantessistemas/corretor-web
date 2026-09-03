import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFavoriteComponent } from './property-favorite';

describe('PropertyFavorite', () => {
  let component: PropertyFavoriteComponent;
  let fixture: ComponentFixture<PropertyFavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyFavoriteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyFavoriteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
