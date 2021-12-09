import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JazzComponent } from './jazz.component';

describe('JazzComponent', () => {
  let component: JazzComponent;
  let fixture: ComponentFixture<JazzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JazzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JazzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
