import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  mean(input: number[]): number {
    input = this.removeNegatives(input)
    const mean = input.reduce((acc, curr)=>{
      return acc + curr
    }, 0) / input.length;
    return mean;
  }

  median(input: number[]) {
    input = this.removeNegatives(input)
    if(input.length ===0) throw new Error("No inputs");

    input.sort(function(a,b){
      return a-b;
    });

    const half = Math.floor(input.length / 2);

    if (input.length % 2)
      return input[half];

    return (input[half - 1] + input[half]) / 2.0;
  }

  mode(input: number[]): number {
    input = this.removeNegatives(input)
    if (input.length === 0) {
      return 0;
    }

    const m = input.reduce((items: any[], current: number) => {
      const item = (items.length === 0) ? null : items.find((x) => x.value === current);
      (item) ? item.occurrence++ : items.push({ value: current, occurrence: 1 });
      return items;
    }, [])
      .sort((a, b) => {
        if (a.occurrence < b.occurrence) {
          return 1;
        } else if (a.occurrence > b.occurrence || a.value < b.value) {
          return -1;
        } else {
          return (a.value === b.value) ? 0 : 1;
        }
      });

    return m[0].value;
  }

  standardDeviation(input: number[]) {
    input = this.removeNegatives(input)
    const mean = this.mean(input);

    // Assigning (value - mean) ^ 2 to every array item
    const squaredDiffs = input.map((k)=>{
      return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let sum = squaredDiffs.reduce((acc, curr)=> acc + curr, 0);

    // Returning the standard deviation
    return Math.sqrt(sum / squaredDiffs.length)
  }

  removeNegatives(inputs: number[]): number[] {
    return inputs.filter(value => value > 0)
  }
}
