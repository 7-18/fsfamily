import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDreamComponent } from './list-dream.component';

describe('ListDreamComponent', () => {
  let component: ListDreamComponent;
  let fixture: ComponentFixture<ListDreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDreamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
