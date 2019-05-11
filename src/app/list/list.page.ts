import { Component } from '@angular/core';
import { Interval, ExponencialRegressionResults } from '../home/models';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage {
  newInterval: Interval;
  intervals: any[];
  result: ExponencialRegressionResults;

  constructor() {
    this.newInterval = {x: 0, y: 0};
    this.result = {a: 0, b: 0, lowerA: 0, lowerB: 0, delta: 0 , discrepanciaCuadrada: 0, sigmaCuadrada: 0, errorA: 0,
      errorB: 0, errorLowerA: 0, errorLowerB: 0, coeficienteCorrelacion: 0 };
    this.intervals = [];
  }
  addInterval() {
    this.intervals.push({x: this.newInterval.x, y: this.newInterval.y});
    this.linearRegresion();
  }

  removeInterval(interval: any) {
    this.intervals.splice(this.intervals.indexOf(interval) - 1);
    this.linearRegresion();
  }

  linearRegresion() {
    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumYY = 0;
    let sumXY = 0;
    let n = 0;
    n = this.intervals.length;
    for (const interval of this.intervals ) {
      sumX += Math.log(interval.x);
      sumY += Math.log(interval.y);
      sumXX += Math.log(interval.x) * Math.log(interval.x);
      sumYY += Math.log(interval.y) * Math.log(interval.y);
      sumXY += Math.log(interval.x) * Math.log(interval.y);
    }
    this.result.a = ((sumY * sumXX) - (sumXY * sumX)) / ((n * sumXX) - (sumX * sumX));
    this.result.b = ((n * sumXY) - (sumX * sumY)) / ((n * sumXX) - (sumX * sumX));
    this.result.delta = (n * sumXX) - (sumX * sumX);
    this.result.discrepanciaCuadrada = (sumYY - (2 * this.result.a * sumY) - (2 * this.result.b * sumXY) +
    (n * (this.result.a * this.result.a)) + (2 * this.result.a * this.result.b * sumX) + ((this.result.b * this.result.b) * sumXX));
    this.result.sigmaCuadrada = this.result.discrepanciaCuadrada / (n - 2);
    this.result.errorA = Math.sqrt((this.result.sigmaCuadrada * sumXX) / this.result.delta);
    this.result.errorB = Math.sqrt((this.result.sigmaCuadrada * n) / this.result.delta);
    this.result.coeficienteCorrelacion = (((n * sumXY) - (sumX * sumY)) / Math.sqrt(((n * sumXX) - (sumX * sumX)) *
    ((n * sumYY) - (sumY * sumY))));
    this.result.lowerA = Math.exp(this.result.a);
    this.result.lowerB = this.result.b;
    this.result.errorLowerA = Math.exp(this.result.a) * this.result.errorA;
    this.result.errorLowerB = this.result.errorB;
  }
}
