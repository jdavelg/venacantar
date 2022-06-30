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

  stats: any= {
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

    console.log(this.campaignId);
    this.getCampaignStats()
  }

  getCampaignStats() {
    this._campaignService.getCampaignData().subscribe(
      resp => {
        /* this.stats = resp */
      },
      error => {
        console.log(error);

      }
    )
  }

}
