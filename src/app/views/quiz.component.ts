import { Component, OnInit } from '@angular/core';
import { Coniugazione, Vocabolo } from '../models/vocabolo.model';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getRandomElement } from '../utils/utils';

export type TipoQuiz = 'ItToEs' | 'EsToIt';

@Component({
    selector: 'app-quiz',
    templateUrl: 'quiz.component.html',
    styleUrls: ['quiz.component.css'],
    imports: [CommonModule, FormsModule]
})
export class QuizComponent implements OnInit {
    currentVocabolo: Vocabolo | null = null;
    tipiQuiz: TipoQuiz[] = ['ItToEs', 'EsToIt'];
    tipoQuiz: TipoQuiz = 'ItToEs';

    // Risposte utente
    userSpagnolo: string = '';
    userItaliano: string = '';
    userConjugation: Coniugazione = this.getEmptyConjugation();

    // Stato del quiz
    isSubmitted: boolean = false;
    isCorrect: boolean = false;
    isCorrectParola: boolean = false;
    isCorrectVerbo: boolean = false;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.loadNext();
    }

    loadNext(): void {
        this.resetState();
        this.currentVocabolo = this.dataService.getRandomVocabolo();
        this.tipoQuiz = getRandomElement(this.tipiQuiz);
        switch(this.tipoQuiz)
        {
            case 'ItToEs': this.userItaliano = this.currentVocabolo!.italiano; break;
            case 'EsToIt': this.userSpagnolo = this.currentVocabolo!.spagnolo; break;
        }
    }

    resetState(): void {
        this.userSpagnolo = '';
        this.userItaliano = '';
        this.userConjugation = this.getEmptyConjugation();
        this.isSubmitted = false;
        this.isCorrect = false;
    }

    checkAnswer(): void {
        if (!this.currentVocabolo) {
            return;
        }

        this.isCorrectParola = this.compare(this.userSpagnolo, this.currentVocabolo.spagnolo)
            && this.compare(this.userItaliano, this.currentVocabolo.italiano);

        if (this.currentVocabolo.tipo === 'verbo') {
            const correct = this.currentVocabolo.coniugazioni[0];
            this.isCorrectVerbo =
                this.compare(this.userConjugation.yo, correct.yo) &&
                this.compare(this.userConjugation.tu, correct.tu) &&
                this.compare(this.userConjugation.el, correct.el) &&
                this.compare(this.userConjugation.nosotros, correct.nosotros) &&
                this.compare(this.userConjugation.vosotros, correct.vosotros) &&
                this.compare(this.userConjugation.ellos, correct.ellos);
        }
        else {
            this.isCorrectVerbo = true;
        }

        this.isCorrect = this.isCorrectParola && this.isCorrectVerbo;
        this.isSubmitted = true;
    }

    private compare(input: string, correct: string): boolean {
        return input.trim().toLowerCase() === correct.trim().toLowerCase();
    }

    private getEmptyConjugation(): Coniugazione {
        return {
            tempo: 'presente',
            yo: '',
            tu: '',
            el: '',
            nosotros: '',
            vosotros: '',
            ellos: '',
        };
    }
}