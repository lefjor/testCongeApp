import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class PublicHolidayService {
  year: number;
  listeFerie;

  constructor() {
    this.year = moment().year();
    this.listeFerie = {
      'Jour de l\'an': this.jourDeLAn(),
      'Fête du travail': this.feteDuTravail(),
      'Victoire des alliés': this.victoireDeAllies(),
      'Fête Nationale': this.feteNationale(),
      'Assomption': this.assomption(),
      'Toussaint': this.toussaint(),
      'Armistice': this.armistice(),
      'Noël': this.noel(),
      'Pâques': this.paques(),
      'Lundi de Pâques': this.lundiDePaques(),
      'Ascension': this.ascension(),
      'Pentecôte': this.pentecote()
    };
  }

  // Source: http://techneilogy.blogspot.fr/2012/02/couple-of-years-ago-i-posted-source.html
  paques(Y = this.year) {
    const a = Y % 19;
    const b = Math.floor(Y / 100);
    const c = Y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n0 = (h + l + 7 * m + 114);
    const n = Math.floor(n0 / 31) - 1;
    const p = n0 % 31 + 1;
    const date = new Date(Y, n, p);
    return moment(date);
  }

  lundiDePaques(Y = this.year) {
    return this.paques(Y).add(1, 'days');
  }


  ascension(Y = this.year) {
    return this.paques(Y).add(39, 'days');
  }


  pentecote(Y = this.year) {
    return this.paques(Y).add(50, 'days');
  }


  jourDeLAn(Y = this.year) {
    return moment('1-1-' + Y, 'DD-MM-YYYY');
  }


  feteDuTravail(Y = this.year) {
    return moment('1-5-' + Y, 'DD-MM-YYYY');
  }

  victoireDeAllies(Y = this.year) {
    return moment('8-5-' + Y, 'DD-MM-YYYY');
  }


  feteNationale(Y = this.year) {
    return moment('14-7-' + Y, 'DD-MM-YYYY');
  }

  assomption(Y = this.year) {
    return moment('15-8-' + Y, 'DD-MM-YYYY');
  }

  toussaint(Y = this.year) {
    return moment('1-11-' + Y, 'DD-MM-YYYY');
  }

  armistice(Y = this.year) {
    return moment('11-11-' + Y, 'DD-MM-YYYY');
  }


  noel(Y = this.year) {
    return moment('25-12-' + Y, 'DD-MM-YYYY');
  }

  getFerieList() {
    let res = [];
    for (let key in this.listeFerie) {
      if (this.listeFerie.hasOwnProperty(key)) {
        res.push({name: key, date: this.listeFerie[key]});
      }
    }
    return res;
  }

  getFerie(date = moment()) {
    for (let key in this.listeFerie) {
      if (this.listeFerie.hasOwnProperty(key)) {
        if (date.isSame(this.listeFerie[key])) {
          return key;
        }
      }
    }
    return null;
  }

  isFerie(date = moment()) {
    return (this.getFerie(date) !== null);
  }

  isWeekEnd(date = moment()) {
    return (date.day() === 0 || date.day() === 6);
  }

  isWorkingDay(date = moment()) {
    return (!this.isWeekEnd(date) && !this.isFerie(date));
  }

  isNotWorkingDay(date = moment()) {
    return (this.isWeekEnd(date) || this.isFerie(date));
  }

}
