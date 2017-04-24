import {Component, OnInit} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocalStorageService} from 'angular-2-local-storage';
import * as moment from 'moment';
import {current} from "codelyzer/util/syntaxKind";

class User {
  username: string;
  lastname: string;
  matricule: string;
  isPartialTime?: boolean;
}

class Conge {
  beginDate:Date;
  isBeginDateMorning:boolean;
  isBeginDateAfternoon:boolean;
  endDate:Date;
  isEndDateMorning:boolean;
  isEndDateBegin:boolean;
  reason:string;
  offDayNumber:number;
  otherDetails:string;
}

@Component({
  selector: 'conge-formulaire',
  templateUrl: './conge-formulaire.component.html',
  styleUrls: ['./conge-formulaire.component.scss']
})
export class CongeFormulaireComponent implements OnInit {
  user = new User();
  conge = new Conge();
  regexDigit = /\d{4}/g;

  constructor(private http:HttpModule, private localStorageService:LocalStorageService) {
  }

  updateOffDayNumber() {
    console.log('updateOffDayNumber');
    if (moment(this.conge.beginDate).isValid() && moment(this.conge.endDate).isValid()) {
      console.log('updating off day number');
      this.conge.offDayNumber = moment(this.conge.endDate).diff(moment(this.conge.beginDate), 'days');
      console.log(moment(this.conge.endDate).diff(moment(this.conge.beginDate), 'days', true));
    }
  }

  updatePartOffDayNumber(event:Event, checkbox:boolean) {
    console.log('updatePartOffDayNumber');
    console.log(event);
    if (checkbox) {
      this.conge.offDayNumber += 0.5;
    } else {
      this.conge.offDayNumber -= 0.5;
    }
  }


  checkText(text:string):boolean {
    if (text !== undefined && text.length > 0) {
      return true;
    }
    return false;
  }

  checkMatricule():boolean {
    return this.user.matricule !== undefined && this.regexDigit.test(this.user.matricule);
  }

  submitConge(conge) {
    // Save to localStorage
    this.localStorageService.set("personalInfo", this.user);
    console.log(conge);
  }

  ngOnInit() {
    // Dates initialization
    this.conge.beginDate = moment().startOf('day').toDate();
    this.conge.endDate = moment(new Date()).startOf('day').add(1, 'days').toDate();
    // Bool for off part initialization
    this.conge.isBeginDateMorning = true;
    this.conge.isBeginDateAfternoon = true;
    this.conge.isEndDateBegin = true;
    this.conge.isEndDateMorning = true;
    // Select init
    this.conge.reason = "CP";

    this.updateOffDayNumber();
    if (this.localStorageService.isSupported) {
      console.log('LocalStorage : Loading data');
      let user = Object.assign(new User(), this.localStorageService.get("personalInfo"));
      if (user) {
        this.user = user;
      } else {
        console.log("No data available from localStorage");
      }
    } else {
      console.log("No localStorage service available");
    }
  }

}
