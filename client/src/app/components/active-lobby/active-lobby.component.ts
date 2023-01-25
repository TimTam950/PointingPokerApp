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

  voteOptions: number[] = [1,2,3,5,8,13,21,34]

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
        this.addNewClients(socketMessage);
      } else if (socketMessage.message_type === "VOTE_CAST") {
        this.connectedUsers = this.connectedUsers.map(connectedUser => {
          if (connectedUser.name === socketMessage.client_name) {
            connectedUser.vote = parseInt(socketMessage.message)
          }
          return connectedUser
        })
      } else if (socketMessage.message_type === "SHOW_VOTES") {
        this.showVotes()
      } else if (socketMessage.message_type === "CLEAR_VOTES") {
        this.clearVotes()
      }
    });

  }

  addNewClients(socketMessage: SocketMessage) {
    const connectedClients = socketMessage.message.split(",");
    for(const connectedClient of connectedClients) {
      if(!this.connectedUsers.some(existingUser => existingUser.name === connectedClient)) {
        this.connectedUsers.push(new UserVote(connectedClient));
      }
    }
  }

  castVote(vote: number) {
    this.lobbyWebSocket.next({message: vote, message_type: "VOTE_CAST"});
  }

  showVotesMessage() {
    this.lobbyWebSocket.next({message: "", message_type: "SHOW_VOTES"});
  }

  showVotes() {
    this.connectedUsers.map(user => user.show = true);
  }

  clearVotesMessage() {
    this.lobbyWebSocket.next({message: "", message_type: "CLEAR_VOTES"})
  }

  clearVotes() {
    this.connectedUsers.map(user => {
      user.vote = -1;
      user.show = false;
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.lobbyWebSocket.unsubscribe();
  }
}
