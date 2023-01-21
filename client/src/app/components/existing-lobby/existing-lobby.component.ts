import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-existing-lobby',
  templateUrl: './existing-lobby.component.html',
  styleUrls: ['./existing-lobby.component.scss']
})
export class ExistingLobbyComponent {

  name: string = "";

  lobbyId: string = "";

  constructor() {
  }

}
