
import {Component, Input, OnInit} from '@angular/core';
import Chart from 'chart.js/auto'
import UserVote from "../../models/UserVote";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './vote-pie-chart.component.html',
  styleUrls: ['./vote-pie-chart.component.scss']
})
export class VotePieChartComponent  implements OnInit {

  ngOnInit(): void {
      this.createChart();
  }

  chart: any;

  @Input() inputData!: UserVote[];

  createChart() {
    const rawVotes = this.inputData.map(vote => vote.vote.toString())

    const voteDist: Map<string, number> = new Map<string, number>();
    for (const vote of rawVotes) {
      if (voteDist.has(vote)) {
        voteDist.set(vote, voteDist.get(vote)! + 1)
      } else {
        voteDist.set(vote, 1)
      }
    }

    console.log(voteDist)

    this.chart = new Chart(
      "pieChart",
      {
        type: "pie",
        data: {
          labels: Array.from(voteDist.keys()),
          datasets: [
            {
              label: "Vote Distribution",
              data: Array.from(voteDist.values())
            }
          ]
        }
      }
    )
  }
}
