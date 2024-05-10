import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoRecargoComponent } from './tipo-recargo.component';

describe('TipoRecargoComponent', () => {
  let component: TipoRecargoComponent;
  let fixture: ComponentFixture<TipoRecargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoRecargoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoRecargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
