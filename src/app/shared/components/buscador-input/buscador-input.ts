import { Component, computed, input, model, output, signal } from '@angular/core';

@Component({
  selector: 'app-buscador-input',
  imports: [],
  templateUrl: './buscador-input.html',
  styleUrl: './buscador-input.css',
})
export class BuscadorInput {
  getResultCount = computed(() => this.searchTerm().length);
  placeholder = input<string>('Buscar...');
  debounceTime = input<number>(800);

  searchTerm = model<string>('');
  // Signals
  isSearching = signal<boolean>(false);
  private debounceTimer = signal<ReturnType<typeof setTimeout> | null>(null);

  hasActiveSearch(): boolean {
    return this.searchTerm().length >= 1;
  }

  /**
   * Maneja el cambio en el input de búsqueda con debounce
   */
  onSearchChange(term: string): void {
    const timer = this.debounceTimer();
    if (timer) {
      clearTimeout(timer);
    }

    // Si el usuario borró todo
    if (term.trim().length === 0) {
      this.searchTerm.set('');
      this.isSearching.set(false);
      return;
    }

    // Menos de 3 letras todavía no buscar
    if (term.trim().length < 3) {
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);

    const newTimer = setTimeout(() => {
      this.searchTerm.set(term);
      this.isSearching.set(false);
    }, this.debounceTime());

    this.debounceTimer.set(newTimer);
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchTerm.set('');
    const timer = this.debounceTimer();
    if (timer) {
      clearTimeout(timer);
    }
    this.isSearching.set(false);
  }
}
