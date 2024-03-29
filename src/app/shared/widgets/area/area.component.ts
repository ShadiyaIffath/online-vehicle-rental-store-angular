import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';


@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  @Input() chartValues;
  chartOptions: {};
  Highcharts = Highcharts;
  constructor() { }

  ngOnInit(): void {
    this.chartOptions = this.chartValues;
    HC_exporting(Highcharts);
  }

}
