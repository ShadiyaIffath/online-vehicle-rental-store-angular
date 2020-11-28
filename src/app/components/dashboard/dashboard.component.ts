import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardCardView } from 'app/models/DashboardCardView';
import { InventoryService } from 'app/services/inventory/inventory.service';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Output() pieChart: {};
  @Output() donutChart: {};
  @Output() barChart: {};
  @Output() areaChart: {};

  today;
  dayBookings = [0, 0, 0, 0, 0, 0, 0];
  days: any[] = [];
  dayLabels: any[] = [];
  dashboardCardView: DashboardCardView;

  constructor(private inventoryService: InventoryService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.inventoryService.getInventoryData().subscribe((data) => {
      this.dashboardCardView = data;
      this.setUpPieChart();
      this.setUpDonutChart();
      this.setUpBarChart();
      this.createWeekDays();
      this.createAreaChartData();
      this.setupAreaChart();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.toastr.error('A server error occured, Try again later.');
      this.router.navigate(['']);
    });
  }

  setUpPieChart() {
    this.pieChart = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: '<b>Booking statistics</b>'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Status',
        colorByPoint: true,
        data: [
          {
            name: 'Completed',
            y: this.dashboardCardView.completedBookins
          }, {
            name: 'Cancelled',
            y: this.dashboardCardView.cancelledBookings
          }, {
            name: 'Confirmed',
            y: this.dashboardCardView.confirmedBookings
          }, {
            name: 'Collected',
            y: this.dashboardCardView.collectedBookings
          }]
      }]
    };
  }

  setUpDonutChart() {
    var active = this.dashboardCardView.accounts.filter(function (car) {
      return car.active === true;
    });
    this.donutChart = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: '<b>Users (Total:' + this.dashboardCardView.accounts.length + ')</b>',
        align: 'center',
        verticalAlign: 'top',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        type: 'pie',
        name: 'Customer status',
        innerSize: '50%',
        data: [
          ['Active', active.length],
          ['Banned', this.dashboardCardView.accounts.length - active.length],
        ]
      }]
    };
  }

  setUpBarChart() {
    this.barChart = {
      chart: {
        type: 'column',
        backgroundColor: null,
        borderWidth: 0,
        margin: [2, 2, 2, 2],
      },
      title: {
        text: '<b>Vehicle Inventory</b>',
        align: 'center',
        verticalAlign: 'top',
        y: 15
      },
      subtitle: {
        text: null
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total available'
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.1f}%'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [
        {
          name: "Vehicles",
          colorByPoint: true,
          data: [
            {
              name: "Town Car",
              y: this.dashboardCardView.smallTownCar,
              drilldown: "Town Car"
            },
            {
              name: "Family Hatchback",
              y: this.dashboardCardView.hatchback,
              drilldown: "Family Hatchback"
            },
            {
              name: "Family Saloon",
              y: this.dashboardCardView.saloon,
              drilldown: "Family Saloon"
            },
            {
              name: "Family Estate",
              y: this.dashboardCardView.estate,
              drilldown: "Family Estate"
            },
            {
              name: "Van",
              y: this.dashboardCardView.vans,
              drilldown: "Van"
            }
          ]
        }
      ]
    };
  }

  setupAreaChart() {
    this.areaChart = {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: 'Vehicles bookings for the week'
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      },
      xAxis: {
        categories: this.dayLabels
      },
      yAxis: {
        title: {
          text: 'No. of active bookings'
        }
      },
      tooltip: {
        shared: true,
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        }
      },
      series: [{
        name: 'Vehicles',
        data: this.dayBookings
      }]
    };
  }

  createAreaChartData() {
    this.dashboardCardView.vehicleBookings.forEach(element => {
      var start = moment(element.startTime).startOf('day');
      var end = moment(element.endTime).startOf('day');
      while (start.isSameOrBefore(end)) {
        if (start.isSame(this.days[0], 'days')) {
          this.dayBookings[0] += 1;
        }
        else if (start.isSame(this.days[1], 'days')) {
          this.dayBookings[1] += 1;
        }
        else if (start.isSame(this.days[2], 'days')) {
          this.dayBookings[2] += 1;
        }
        else if (start.isSame(this.days[3], 'days')) {
          this.dayBookings[3] += 1;
        }
        else if (start.isSame(this.days[4], 'days')) {
          this.dayBookings[4] += 1;
        }
        else if (start.isSame(this.days[5], 'days')) {
          this.dayBookings[5] += 1;
        }
        else if (start.isSame(this.days[6], 'days')) {
          this.dayBookings[6] += 1;
        }
        start.add(1, 'days');
      }
    });
  }

  createWeekDays() {
    var currentDate = moment();
    var weekStart = currentDate.clone().startOf('day');

    for (var i = 0; i <= 6; i++) {
      this.days.push(moment(weekStart).add(i, 'days'));
      this.dayLabels.push(moment(weekStart).add(i, 'days').format('Do ddd'));
    };
  }

}
