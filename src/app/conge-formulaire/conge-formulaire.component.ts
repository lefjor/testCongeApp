import { Component, OnInit } from '@angular/core';

class User {
  username:string;
  password:string;
}

@Component({
  selector: 'conge-formulaire',
  templateUrl: './conge-formulaire.component.html',
  styleUrls: ['./conge-formulaire.component.scss']
})
export class CongeFormulaireComponent implements OnInit {
  user = new User();

  constructor() {
  }

  submitConge(firstname) {
    console.log(firstname.value);
  }

  ngOnInit() {
  }

}
