import { Component, OnInit } from '@angular/core';
import { Vocabolo } from '../models/vocabolo.model';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-list',
    templateUrl: 'edit-list.component.html',
    styleUrls: ['edit-list.component.css'],
    imports: [CommonModule, FormsModule]
})
export class EditListComponent implements OnInit {
    vocaboli: Vocabolo[] = [];

    // Gestione Dialog
    showEditDialog: boolean = false;
    selectedVocabolo: Vocabolo | null = null;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.vocaboli$.subscribe(data => this.vocaboli = data);
    }

    onDelete(v: Vocabolo) {
        if (confirm(`Sei sicuro di voler eliminare "${v.spagnolo}"?`)) {
            this.dataService.deleteVocabolo(v.id);
        }
    }

    openEdit(v: Vocabolo) {
        // Creiamo una copia profonda per non modificare l'originale prima di confermare
        this.selectedVocabolo = JSON.parse(JSON.stringify(v));
        this.showEditDialog = true;
    }

    closeEdit() {
        this.showEditDialog = false;
        this.selectedVocabolo = null;
    }

    saveEdit() {
        if (this.selectedVocabolo) {
            this.dataService.updateVocabolo(this.selectedVocabolo.id, this.selectedVocabolo);
            this.closeEdit();
        }
    }
}