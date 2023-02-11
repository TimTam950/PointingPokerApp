export default class UserVote {

  name: string;
  vote: number;
  show: boolean = false;
  hasVoted: boolean = false;

  constructor(name: string, vote: number = -1) {
    this.name = name;
    this.vote = vote;
  }
}
