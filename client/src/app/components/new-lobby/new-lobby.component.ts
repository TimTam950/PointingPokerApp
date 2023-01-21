import {Component} from '@angular/core';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-new-lobby',
  templateUrl: './new-lobby.component.html',
  styleUrls: ['./new-lobby.component.scss']
})
export class NewLobbyComponent {

  name: string = ""

  lobbyName: string = uuidv4();

  constructor() {
  }

}
