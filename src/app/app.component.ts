import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SpeedTestService} from "ng-speed-test";
import {RestService} from "./services/rest.service";
import {LoginModalComponent} from "./components/login-modal/login-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SpeedTestData} from "./models/speed-test-data";
import {GeolocationService} from "./services/geolocation.service";
import {RegisterModalComponent} from "./components/register-modal/register-modal.component";
import {SettingsModalComponent} from "./components/settings-modal/settings-modal.component";
import {ChartConfiguration, ChartType} from "chart.js";
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public currentSpeed = '0';
  public readonly iterationsInOneMeasurement = 1;
  public readonly measurementsInOneSpeedTest = 5;
  public speedTestRunning = false;
  public speedTestFinish = false;
  public showHistory = false;
  public addToHistoryEnable = false;
  public userLoggedIn;
  public userMail = ''

  public average = 0;
  public max = 0;
  public min = 0;
  public median = 0;
  public geolocation: string;

  displayedColumns: string[] = ['average', 'median', 'max', 'min', 'geolocation', 'date'];
  history: SpeedTestData[] = [];

  public chartData = [];

  public lineChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute'
        },
        display: true,
        title: {
          display: true,
          text: 'Data'
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Średnia prędkośc pobierania [Mbps]'
        }
      }
    }
  };

  constructor(private speedTestService: SpeedTestService,
              private restService: RestService,
              private matDialog: MatDialog,
              private geolocationService: GeolocationService) {
    this.userLoggedIn = this.restService.currentUserId != null;
    if (this.userLoggedIn) {
      this.userMail = this.restService.userEmail;
    }
  }

  public lineChartType: ChartType = 'line';

  async ngOnInit() {
    this.geolocation = await this.geolocationService.getUserLocation();
  }

  public ngAfterViewInit() {
    document.scrollingElement.scrollTo({top: 0});
  }


  async runSpeedTest(): Promise<void> {
    this.speedTestRunning = true;
    this.speedTestFinish = false;
    this.showHistory = false;
    this.addToHistoryEnable = false;
    let results: number[] = [];
    this.currentSpeed = '0';
    for (let i = 0; i < this.measurementsInOneSpeedTest; i++) {
      const speed = await this.speedTestService.getMbps({iterations: this.iterationsInOneMeasurement}).toPromise();
      results.push(speed);
      this.currentSpeed = this.countAverage(results).toFixed(2);
    }
    this.average = this.countAverage(results);
    this.max = Math.max(...results);
    this.min = Math.min(...results);
    this.median = this.countMedian(results);
    this.speedTestRunning = false;
    this.speedTestFinish = true;
    this.addToHistoryEnable = true;
  }

  public showHistoryOfSpeedTests(): void {
    this.restService.getSpeedTestHistory().subscribe(response => {
      this.history = response.reverse();
      this.showHistory = true;
      console.log(this.history.map(test => new Date(test.testTime)))
      this.chartData = [{
       data: [...this.history.map(test => {
         return {
           x: new Date(test.testTime),
           y: test.averageDownload
         }
       })],
       label: 'Średnia prędkość pobierania [Mbps]'
      }]
        ;
      setTimeout(() => {
        document.getElementById('history').scrollIntoView({behavior: "smooth"});
      }, 200);
    }, () => {});
  }

  public addSpeedTestToHistory(): void {
    this.addToHistoryEnable = false;
    let speedTestData = new SpeedTestData(
      this.average,
      this.min,
      this.max,
      this.median,
      this.geolocation
    )
    this.restService.addSpeedTestToHistory(speedTestData).subscribe(response => {
      this.showHistoryOfSpeedTests();
    }, () => {});
  }

  public openLoginModal(): void {
    this.matDialog.open(LoginModalComponent, {width: '20%'});
  }

  public openRegisterModal(): void {
    this.matDialog.open(RegisterModalComponent, {width: '20%'});
  }

  public openSettingsModal(): void {
    this.matDialog.open(SettingsModalComponent, {width: '30%'}).afterClosed().subscribe(() => {
      if (this.userLoggedIn) {
        this.userMail = this.restService.userEmail;
      }
    });
  }

  public logout(): void {
    this.restService.logout().subscribe(() => {
      localStorage.clear();
      window.location.reload();
    }, (error) => {
      console.log(error);
    });
  }

  public countAverage(arr: number[]): number {
    return (arr.reduce((a,b) => a + b, 0) / arr.length);
  }

  public countMedian(arr: number[]) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }


}
