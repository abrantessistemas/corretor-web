import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeDialog } from './welcome-dialog';

describe('WelcomeDialog', () => {
  let component: WelcomeDialog;
  let fixture: ComponentFixture<WelcomeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
