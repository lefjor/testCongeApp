import {Component, OnInit, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {LocalStorageService} from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import {
  NgbDatepickerI18n,
  NgbDatepickerConfig,
  NgbDateStruct,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from "./ngb-date-fr-parser-formatter";
import * as moment from 'moment';
import {PublicHolidayService} from '../public-holiday.service';

const I18N_VALUES = {
  fr: {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned.
@Injectable()
export class I18n {
  language = 'fr';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n:I18n) {
    super();
  }

  getWeekdayShortName(weekday:number):string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }

  getMonthShortName(month:number):string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }

  getMonthFullName(month:number):string {
    return this.getMonthShortName(month);
  }
}

class UserConge {
  user:User;
  conge:Conge;
}

class User {
  firstname:string;
  lastname:string;
  matricule:string;
  isPartialTime
?:
  boolean;
}

class Conge {
  beginDate:Date;
  isBeginDateMorning:boolean;
  isBeginDateAfternoon:boolean;
  endDate:Date;
  isEndDateMorning:boolean;
  isEndDateAfternoon:boolean;
  reason:string;
  offDayNumber:number;
  otherDetails:string;
  isError:boolean;
  errorMessage:string;
}

@Component({
  selector: 'conge-formulaire',
  templateUrl: './conge-formulaire.component.html',
  styleUrls: ['./conge-formulaire.component.scss'],
  providers: [PublicHolidayService, I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    NgbDatepickerConfig, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}] // define custom NgbDatepickerI18n provider
})
export class CongeFormulaireComponent implements OnInit {
  user = new User();
  conge = new Conge();
  modelBeginDate:NgbDateStruct;
  modelEndDate:NgbDateStruct;

  /**
   * Constructor
   * @param http
   * @param localStorageService
   * @param _i18n
   * @param datepickerConfig
   * @param publicHolidayService
   */
  constructor(private http:Http,
              private localStorageService:LocalStorageService,
              private _i18n:I18n,
              private datepickerConfig:NgbDatepickerConfig,
              private publicHolidayService:PublicHolidayService) {
    // weekends and public holidays are disabled
    datepickerConfig.markDisabled = (date:NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return publicHolidayService.isNotWorkingDay(moment(d));
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
  isValidDate(date:Date):boolean {
    return date && moment(date).isValid();
  }

  onSelectBeginDate(date:NgbDateStruct):void {
    this.modelBeginDate = date;
    this.conge.beginDate = new Date(date.year, date.month - 1, date.day);
    this.validateConge();
  }

  onSelectEndDate(date:NgbDateStruct):void {
    this.modelEndDate = date;
    this.conge.endDate = new Date(date.year, date.month - 1, date.day);
    this.validateConge();
  }

  validateConge():boolean {

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
        var offDayNumber = 0;

        // Weekends calcul and holidays

        var tmpDate = mBeginDate;
        while (tmpDate.isSameOrBefore(mEndDate)) {
          if (this.publicHolidayService.isWorkingDay(tmpDate)) {
            offDayNumber++;
          }
          tmpDate.add(1, 'days');
        }

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
      if (offDayNumber === 0) {
        this.conge.isError = true;
        this.conge.errorMessage = "Matin ou après-midi il faudrait savoir ?";
      }
    } else if (this.conge.beginDate === undefined) {
      console.log('cas 4');
      this.conge.isError = true;
      this.conge.errorMessage = "La date de début doit être définie/valide.";
    } else {
      console.log('cas 5');
      this.conge.isError = true;
      this.conge.errorMessage = "Tu veux le poser ton congé ?";
    }
    return this.conge.isError;
  }

  /**
   * Verify the validity of a text
   * @param text
   * @returns {boolean}
   */
  checkText(text:string):boolean {
    if (text !== undefined && text.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Verify the validity of the matricule
   * @param matricule
   * @returns {boolean}
   */
  checkMatricule(matricule = this.user.matricule):boolean {
    const regexDigit = /\d{4}/g;
    return matricule !== undefined && regexDigit.test(matricule);
  }

  /**
   * Validate a complete user
   * @param user
   * @returns {boolean}
   */
  validateUser(user:User):boolean {
    return this.checkText(user.firstname) && this.checkText(user.lastname) && this.checkMatricule(user.matricule);
  }

  private headers = new Headers({'Content-Type': 'application/json'});

  submitConge(conge) {

    if (this.validateUser(this.user) && !this.validateConge()) {
      // Save to localStorage
      this.localStorageService.set('personalInfo', this.user);
      console.log('conge', this.conge);
      console.log('user', this.user);
      // http call to nodejs server
      let userConge = new UserConge();
      userConge.conge = this.conge;
      userConge.user = this.user;

      this.http
        .put("http://localhost:3000/text", JSON.stringify(userConge), {headers: this.headers})
        .toPromise()
        .then(response => response.json().data)
        .catch(this.handleError);

    } else {
      console.log('non valide');
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
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

    this.validateConge();

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

    if (this.user.isPartialTime === undefined) {
      this.user.isPartialTime = false;
    }
  }
}
