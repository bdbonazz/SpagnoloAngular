import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Vocabolo } from '../models/vocabolo.model';
import { getRandomElement } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY = 'spagnolo_vocab_data';

  // Usiamo un BehaviorSubject per rendere i dati "reattivi" in tutta l'app
  private vocaboliSource = new BehaviorSubject<Vocabolo[]>(this.loadFromStorage());
  vocaboli$: Observable<Vocabolo[]> = this.vocaboliSource.asObservable();

  constructor() { }

  // --- CRUD BASE ---

  addVocabolo(nuovo: Vocabolo) {
    const currentList: Vocabolo[] = this.vocaboliSource.value;
    const updatedList: Vocabolo[] = [...currentList, { ...nuovo, id: Date.now() }];
    this.updateData(updatedList);
  }

  getVocaboli(): Vocabolo[] {
    return this.vocaboliSource.value;
  }

  // --- PERSISTENZA LOCAL STORAGE ---

  private updateData(newList: Vocabolo[]) {
    this.vocaboliSource.next(newList);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
  }

  private loadFromStorage(): Vocabolo[] {
    const saved: string | null = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  // --- IMPORT / EXPORT JSON ---

  exportToJson() {
    const data: string = JSON.stringify(this.vocaboliSource.value, null, 2);
    const blob: Blob = new Blob([data], { type: 'application/json' });
    const url: string = window.URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `vocabolario_spagnolo_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  importFromJson(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const importedData: Vocabolo[] = JSON.parse(e.target.result);

          // Uniamo i dati esistenti con i nuovi (o sovrascriviamo, a tua scelta)
          const currentData: Vocabolo[] = this.vocaboliSource.value;
          const mergedData: Vocabolo[] = [...currentData, ...importedData];

          this.updateData(mergedData);
          resolve(true);
        } catch (err) {
          console.error("Errore nel parsing del JSON", err);
          reject(false);
        }
      };

      reader.readAsText(file);
    });
  }

  // --- LOGICA QUIZ ---

  getRandomVocabolo(): Vocabolo | null {
    const list: Vocabolo[] = this.vocaboliSource.value;
    if (list.length === 0) {
      return null;
    }
    return getRandomElement(list);
  }

  deleteVocabolo(id: number) {
    const updatedList: Vocabolo[] = this.vocaboliSource.value.filter(v => v.id !== id);
    this.updateData(updatedList);
  }

  updateVocabolo(id: number, datiAggiornati: Vocabolo) {
    const currentList: Vocabolo[] = this.vocaboliSource.value;
    const index: number = currentList.findIndex(v => v.id === id);
    if (index !== -1) {
      currentList[index] = { ...datiAggiornati, id }; // Mantieni lo stesso ID
      this.updateData([...currentList]);
    }
  }
}