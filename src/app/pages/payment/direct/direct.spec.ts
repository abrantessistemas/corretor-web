import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectComponent } from './direct';


describe('Direct', () => {
  let component: DirectComponent;
  let fixture: ComponentFixture<DirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
