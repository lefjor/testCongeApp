import {Component, OnInit, Injectable} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocalStorageService} from 'angular-2-local-storage';
import {NgbDatepickerI18n, NgbDatepickerConfig, NgbDateStruct, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "./ngb-date-fr-parser-formatter";
import * as moment from 'moment';

const I18N_VALUES = {
  fr: {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned.
@Injectable()
export class I18n {
  language = 'en';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

class User {
  username: string;
  lastname: string;
  matricule: string;
  isPartialTime?: boolean;
}

class Conge {
  beginDate: Date;
  isBeginDateMorning: boolean;
  isBeginDateAfternoon: boolean;
  endDate: Date;
  isEndDateMorning: boolean;
  isEndDateAfternoon: boolean;
  reason: string;
  offDayNumber: number;
  otherDetails: string;
  isError: boolean;
  errorMessage: string;
}

@Component({
  selector: 'conge-formulaire',
  templateUrl: './conge-formulaire.component.html',
  styleUrls: ['./conge-formulaire.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, NgbDatepickerConfig, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}] // define custom NgbDatepickerI18n provider
})
export class CongeFormulaireComponent implements OnInit {
  user = new User();
  conge = new Conge();
  regexDigit = /\d{4}/g;
  modelBeginDate: NgbDateStruct;
  modelEndDate: NgbDateStruct;

  /**
   *
   * @param http
   * @param localStorageService
   */
  constructor(private http: HttpModule,
              private localStorageService: LocalStorageService,
              private _i18n: I18n,
              private datepickerConfig: NgbDatepickerConfig) {
    // weekends are disabled
    datepickerConfig.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return d.getDay() === 0 || d.getDay() === 6;
    };
    datepickerConfig.showWeekNumbers = true;
    datepickerConfig.outsideDays = 'collapsed';
    datepickerConfig.navigation = 'arrows';

    const now = new Date();
    this.modelBeginDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  /**
   * Date's validation
   * @param date
   * @returns {Date|boolean}
   */
  isValidDate(date: Date): boolean {
    return date && moment(date).isValid();
  }

  onSelectBeginDate(date: NgbDateStruct) {
    this.modelBeginDate = date;
    this.conge.beginDate = new Date(date.year, date.month -1, date.day);
    this.updateOffDayNumber();
  }

  onSelectEndDate(date: NgbDateStruct) {
    this.modelEndDate = date;
    this.conge.endDate = new Date(date.year, date.month -1, date.day);
    this.updateOffDayNumber();
  }

  updateOffDayNumber() {

    let mBeginDate = moment(this.conge.beginDate);
    let mEndDate = moment(this.conge.endDate);

    // console.log('begindate', this.conge.beginDate);
    // console.log('begindate valid', mBeginDate.isValid());
    // console.log('enddate', this.conge.endDate);
    // console.log('enddate valid', mEndDate.isValid());

    this.conge.isError = false;

    if (this.isValidDate(this.conge.beginDate) && this.isValidDate(this.conge.endDate) && this.conge.isBeginDateAfternoon) {
      if (mEndDate.isAfter(mBeginDate)) {
        console.log('cas 1');
        var offDayNumber = moment(this.conge.endDate).diff(moment(this.conge.beginDate), 'days') + 1;
        if (!this.conge.isBeginDateMorning) {
          offDayNumber -= 0.5;
        }
        if (!this.conge.isBeginDateAfternoon) {
          offDayNumber -= 0.5;
        }
        if (!this.conge.isEndDateMorning) {
          offDayNumber -= 0.5;
        }
        if (!this.conge.isEndDateAfternoon) {
          offDayNumber -= 0.5;
        }
        this.conge.offDayNumber = offDayNumber;
      } else {
        console.log('cas 2');
        this.conge.isError = true;
        this.conge.errorMessage = "La date de fin de congé doit être supérieure strictement à la date de début.";
        this.conge.offDayNumber = 0;
      }
    } else if (this.isValidDate(this.conge.beginDate)
      && (this.conge.endDate === undefined || !mEndDate.isValid() || (!this.conge.isBeginDateAfternoon && this.isValidDate(this.conge.endDate)))) {
      console.log('cas 3');
      var offDayNumber = 1;
      if (!this.conge.isBeginDateMorning) {
        offDayNumber -= 0.5;
      }
      if (!this.conge.isBeginDateAfternoon) {
        offDayNumber -= 0.5;
      }
      this.conge.offDayNumber = offDayNumber;
    } else if (this.conge.beginDate === undefined) {
      console.log('cas 4');
      this.conge.isError = true;
      this.conge.errorMessage = "La date de début doit être définie/valide.";
    } else {
      console.log('cas 5');
      this.conge.isError = true;
      this.conge.errorMessage = "Tu veux le poser ton congé ?";
    }
  }

  /**
   *
   * @param text
   * @returns {boolean}
   */
  checkText(text: string): boolean {
    if (text !== undefined && text.length > 0) {
      return true;
    }
    return false;
  }

  checkMatricule(): boolean {
    return this.user.matricule !== undefined && this.regexDigit.test(this.user.matricule);
  }

  submitConge(conge) {
    // Save to localStorage
    this.localStorageService.set('personalInfo', this.user);
    console.log(conge);
  }

  ngOnInit() {
    this._i18n.language = 'fr';
    /*
     CONGE INIT
     */

    // Dates initialization
    this.conge.beginDate = moment().startOf('day').toDate();

    // Bool for off part initialization
    this.conge.isBeginDateMorning = true;
    this.conge.isBeginDateAfternoon = true;
    this.conge.isEndDateAfternoon = true;
    this.conge.isEndDateMorning = true;

    // Select init
    this.conge.reason = 'CP';

    this.updateOffDayNumber();

    /*
     USER INIT
     */

    if (this.localStorageService.isSupported) {
      console.debug('LocalStorage : Loading data');
      let user = Object.assign(new User(), this.localStorageService.get('personalInfo'));
      if (user) {
        this.user = user;
      } else {
        console.debug('No data available from localStorage');
      }
    } else {
      console.debug('No localStorage service available');
    }

    if(this.user.isPartialTime === undefined) {
      console.log("isPartialTime init");
      this.user.isPartialTime = false;
    }
  }
}
