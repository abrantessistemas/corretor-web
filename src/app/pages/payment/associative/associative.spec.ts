import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociativeComponent } from './associative';


describe('Associative', () => {
  let component: AssociativeComponent;
  let fixture: ComponentFixture<AssociativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociativeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociativeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
