import {Component, OnInit} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocalStorageService} from 'angular-2-local-storage'

class User {
  username:string;
  lastname:string;
  matricule:string;
  isPartialTime:boolean;
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

  constructor(private http:HttpModule, private localStorageService:LocalStorageService) {
  }


  checkText(text:string):boolean {
    if (text !== undefined && text.length > 0) {
      return true;
    }
    return false;
  }

  checkMatricule():boolean {
    if (this.user.matricule !== undefined && this.user.matricule.length === 4) {
      return true;
    }
    return false;
  }

  submitConge(firstname) {
    // Save to localStorage
    this.localStorageService.set("personalInfo", this.user);
  }

  ngOnInit() {
    if (this.localStorageService.isSupported) {
      console.log('LocalStorage : Loading data');
      let user = Object.assign(new User(), this.localStorageService.get("personalInfo"));
      if (user) {
        this.user = user;
      } else {
        console.log("No data available from localStorage");
      }
    } else{
      console.log("No localStorage service available");
    }
  }

}
