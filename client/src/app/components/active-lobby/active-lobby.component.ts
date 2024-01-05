import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import SocketMessage from "../../models/SocketMessage";
import UserVote from "../../models/UserVote";
import {StatisticsService} from "../../services/statistics.service";
import {CdTimerComponent} from "angular-cd-timer";
import { environment } from "../../../environments/environment";

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

  statistics: Map<string, number> = new Map<string, number>();

  areStatsShowing = false;

  @ViewChild('timerComponent')
  timer!: CdTimerComponent;

  constructor(private route: ActivatedRoute, private statService: StatisticsService) {

  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(paramMap => {
      this.connectedUser = paramMap.get('connectedUser');
      this.lobbyId = paramMap.get('lobbyId');
      this.lobbyWebSocket = webSocket(`wss://${environment.apiRootUrl}/ws/${this.lobbyId}/${this.connectedUser}`);
    })
    this.lobbyWebSocket.subscribe(dataFromSocket => {
      const socketMessage = JSON.parse(dataFromSocket as string) as SocketMessage;
      if(socketMessage.message_type === "NEW_USER_CONNECTED") {
        this.addNewClients(socketMessage);
      } else if (socketMessage.message_type === "VOTE_CAST") {
        this.updateUserVote(socketMessage);
      } else if (socketMessage.message_type === "SHOW_VOTES") {
        this.showVotes()
        this.calculateStatistics()
        this.showStatistics();
      } else if (socketMessage.message_type === "CLEAR_VOTES") {
        this.hideStatistics()
        this.clearVotes()
        this.timer.reset()
        this.timer.start()
      }
    });

  }

  updateUserVote(socketMessage: SocketMessage) {
    this.connectedUsers = this.connectedUsers.map(connectedUser => {
      if (connectedUser.name === socketMessage.client_name) {
        connectedUser.vote = parseInt(socketMessage.message)
        connectedUser.hasVoted = true;
      }
      return connectedUser
    })
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
      user.hasVoted = false;
    });
  }

  calculateStatistics() {
    const votes = this.connectedUsers.map(userVote => userVote.vote)
    this.statistics.set("Mean", this.statService.mean(votes))
    this.statistics.set("Median", this.statService.median(votes))
    this.statistics.set("Mode", this.statService.mode(votes))
    this.statistics.set("Standard Deviation", this.statService.standardDeviation(votes))
  }

  showStatistics() {
    this.areStatsShowing = true;
  }

  hideStatistics() {
    this.areStatsShowing = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.lobbyWebSocket.unsubscribe();
  }
}
