import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIncidencia } from './detalle-incidencia';
import { Incidencia } from 'src/app/core/models/incident.model';

describe('DetalleIncidencia', () => {
  let component: DetalleIncidencia<Incidencia>;
  let fixture: ComponentFixture<DetalleIncidencia<Incidencia>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleIncidencia]
    })
    .compileComponents();

   /* fixture = TestBed.createComponent(DetalleIncidencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();*/
  })
});
