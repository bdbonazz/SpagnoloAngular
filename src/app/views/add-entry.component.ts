import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Vocabolo } from '../models/vocabolo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-entry',
  templateUrl: 'add-entry.component.html',
  styleUrls: ['add-entry.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddEntryComponent implements OnInit {
  @ViewChild('spagnolo') spagnoloElement!: ElementRef;
  public entryForm!: FormGroup;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.entryForm = this.fb.group({
      spagnolo: ['', [Validators.required]],
      italiano: ['', [Validators.required]],
      tipo: ['parola', [Validators.required]],
      // Sottogruppo per la coniugazione, opzionale
      coniugazione: this.fb.group({
        tempo: ['presente'],
        yo: [''],
        tu: [''],
        el: [''],
        nosotros: [''],
        vosotros: [''],
        ellos: ['']
      })
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {

    // Osserva i cambiamenti del tipo per aggiungere/rimuovere validazioni se necessario
    this.entryForm.get('tipo')?.valueChanges.subscribe(tipo => {
      if (tipo === 'parola') {
        this.entryForm.get('coniugazione')?.disable();
      } else {
        this.entryForm.get('coniugazione')?.enable();
      }
    });

    // Inizialmente disabilitato perché il default è 'parola'
    this.entryForm.get('coniugazione')?.disable();
  }

  onSubmit(): void {
    if (!this.entryForm.valid) {
      return;
    }
    const formValue: any = this.entryForm.getRawValue();

    const nuovoVocabolo: Vocabolo = {
      id: Date.now(),
      spagnolo: formValue.spagnolo,
      italiano: formValue.italiano,
      tipo: formValue.tipo,
      // Salviamo la coniugazione solo se è un verbo
      coniugazioni: [],
    };
    if(formValue.tipo === 'verbo')
    {
      nuovoVocabolo.coniugazioni.push(formValue.coniugazione);
    }

    this.dataService.addVocabolo(nuovoVocabolo);

    // Reset e feedback
    this.successMessage = 'Inserimento avvenuto con successo!';
    this.entryForm.reset({ tipo: 'parola' });
    this.entryForm.get('coniugazione')?.disable();

    this.spagnoloElement.nativeElement.focus();
    setTimeout(() => this.successMessage = '', 3000);
  }
}
