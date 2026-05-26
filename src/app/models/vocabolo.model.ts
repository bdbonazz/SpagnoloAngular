export type TipoVocabolo = 'parola' | 'verbo';
export interface Vocabolo {
  id: number;
  spagnolo: string;
  italiano: string;
  tipo: TipoVocabolo;
  coniugazioni: Coniugazione[];
}
export interface Coniugazione {
  tempo: 'presente';
  yo: string;
  tu: string;
  el: string;
  nosotros: string;
  vosotros: string;
  ellos: string;
}