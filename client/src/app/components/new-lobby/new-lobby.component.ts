import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-new-lobby',
  templateUrl: './new-lobby.component.html',
  styleUrls: ['./new-lobby.component.scss']
})
export class NewLobbyComponent implements OnInit {

  newLobbyForm!: FormGroup

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.newLobbyForm = this.fb.group({
      name: ''
    })
  }


}
