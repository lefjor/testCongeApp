import { Component, OnInit } from '@angular/core';
import { HttpModule } from '@angular/http';

class User {
  username:string;
  lastname:string;
  matricule:string;
}

@Component({
  selector: 'conge-formulaire',
  templateUrl: './conge-formulaire.component.html',
  styleUrls: ['./conge-formulaire.component.scss']
})
export class CongeFormulaireComponent implements OnInit {
  user = new User();

  constructor(private http : HttpModule) {
  }

  submitConge(firstname) {
    console.log(firstname.value);
  }

  ngOnInit() {
  }

}
