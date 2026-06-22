import { Component, computed, input, model } from '@angular/core';

export interface DetalleField<T> {
  label: string;
  key: keyof T;

  // para valores simples
  format?: (value: any) => string;

  // para arrays
  isArray?: boolean;
  itemFormat?: (item: any) => string;
}

interface CampoDetalle {
  label: string;
  value: unknown;
  isArray: boolean;
  items: unknown[];
  itemFormat?: (item: any) => string;
}

@Component({
  selector: 'app-detalle-modal',
  imports: [],
  templateUrl: './detalle-modal.html',
  styleUrl: './detalle-modal.css',
})
export class DetalleModal<T extends Record<string, any>> {
  modal = model(false);

  data = input<T | null>(null);
  fields = input<DetalleField<T>[]>([]);

  title = input('Detalle del registro');
  description = input('Información completa del registro seleccionado');
  error = input('');

  campos = computed<CampoDetalle[]>(() => {
    const entity = this.data();

    if (!entity) {
      return [];
    }

    return this.fields().map(field => {
      const rawValue = entity[field.key];

      return {
        label: field.label,

        value: field.format
          ? field.format(rawValue)
          : rawValue,

        isArray: !!field.isArray,

        items: Array.isArray(rawValue)
          ? rawValue as unknown[]
          : [],

        itemFormat: field.itemFormat
      };
    });
  });

  openBox() {
    this.modal.update(m => !m);
  }
}
