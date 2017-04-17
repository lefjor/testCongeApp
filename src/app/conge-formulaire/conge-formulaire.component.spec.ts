import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeFormulaireComponent } from './conge-formulaire.component';

describe('CongeFormulaireComponent', () => {
  let component: CongeFormulaireComponent;
  let fixture: ComponentFixture<CongeFormulaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongeFormulaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongeFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
