import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrooveComponent } from './groove.component';

describe('GrooveComponent', () => {
  let component: GrooveComponent;
  let fixture: ComponentFixture<GrooveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrooveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrooveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
