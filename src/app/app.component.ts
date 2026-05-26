import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { AddEntryComponent } from './views/add-entry.component';
import { QuizComponent } from './views/quiz.component';
import { EditListComponent } from './views/edit-list.component';

export type ViewType = 'add' | 'quiz' | 'edit';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  imports: [CommonModule, AddEntryComponent, QuizComponent, EditListComponent]
})
export class AppComponent {
  // Gestiamo la navigazione semplice con una stringa
  currentView: ViewType = 'add';

  constructor(private dataService: DataService) { }

  setView(view: ViewType) {
    this.currentView = view;
  }

  onExport() {
    this.dataService.exportToJson();
  }

  onImport(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.dataService.importFromJson(file).then(success => {
        if (success) {
          alert('Dati importati con successo!');
          // Resetta l'input file per permettere caricamenti successivi dello stesso file
          event.target.value = '';
        }
      }).catch(_ => alert('Errore durante l\'importazione. Controlla il formato del file.'));
    }
  }
}