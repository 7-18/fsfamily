import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDreamComponent } from './save-dream.component';

describe('SaveDreamComponent', () => {
  let component: SaveDreamComponent;
  let fixture: ComponentFixture<SaveDreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveDreamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
