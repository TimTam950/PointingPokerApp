import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import SocketMessage from "../../models/SocketMessage";
import UserVote from "../../models/UserVote";

@Component({
  selector: 'app-active-lobby',
  templateUrl: './active-lobby.component.html',
  styleUrls: ['./active-lobby.component.scss']
})
export class ActiveLobbyComponent implements OnInit, OnDestroy {

  connectedUser: string | null = "";
  lobbyId: string | null = ""
  routeSubscription!: Subscription ;

  lobbyWebSocket!: WebSocketSubject<unknown>;
  connectedUsers: UserVote[] = [];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => {
      this.connectedUser = paramMap.get('connectedUser');
      this.lobbyId = paramMap.get('lobbyId');
      this.lobbyWebSocket = webSocket(`ws://127.0.0.1:8000/ws/${this.lobbyId}/${this.connectedUser}`);
    })
    this.lobbyWebSocket.subscribe(dataFromSocket => {
      const socketMessage = JSON.parse(dataFromSocket as string) as SocketMessage;
      if(socketMessage.message_type === "NEW_USER_CONNECTED") {
        this.connectedUsers.push(new UserVote(socketMessage.client_name));
      } else if (socketMessage.message_type === "VOTE_CAST") {
        const voteToUpdate = this.connectedUsers.find(vote => vote.name === socketMessage.client_name);
      }
    });

  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
