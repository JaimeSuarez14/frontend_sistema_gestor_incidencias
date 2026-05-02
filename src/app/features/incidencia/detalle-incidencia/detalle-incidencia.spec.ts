import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIncidencia } from './detalle-incidencia';

describe('DetalleIncidencia', () => {
  let component: DetalleIncidencia;
  let fixture: ComponentFixture<DetalleIncidencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleIncidencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleIncidencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
