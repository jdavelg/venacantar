import { Component, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Singer } from '../models/singer';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { global } from '../models/global';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class StatsComponent implements OnInit {
  @Input() campaignId: any;
  tableStats:any
  totalVotes:any=0
stats={
  labels:[],
  datasets:[{data:[], backgroundColor:[]}]
}
  newstats: any= {
      labels: ['A','B','C'],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }
      ]
 
  }
  chartOptions: any;
  constructor(
    private _authService: AuthService,
    private _campaignService: UserService,
    private messageService: MessageService, private confirmationService: ConfirmationService
  ) {
 
  }

  ngOnInit(): void {
   this.getCampaignStats()
   /*  console.log(this.campaignId); */

  }
  

  getCampaignStats() {
    this._campaignService.getCampaignData(this.campaignId).subscribe(
      resp => {
        /* this.stats = resp */
    /*  console.log(resp); */
        if (resp.length>=1) {
          this.tableStats=resp

         
          resp.forEach(cantante => {
            let color= Math.floor(Math.random()*16777215).toString(16);
            this.stats.labels.push(cantante.name)
             this.totalVotes += cantante.votes
            this.stats.datasets[0].data.push(cantante.votes)
            this.stats.datasets[0].backgroundColor.push('#'+color)
          });
       /*    console.log('stats',
            this.stats
          ); */
          
        }
      },
      error => {
        console.log(error);

      }
    )
  }

}
