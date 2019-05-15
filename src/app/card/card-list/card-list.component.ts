import { Component, OnInit } from '@angular/core';
import {forkJoin} from 'rxjs';
import {Card} from '../card';
import { CardService } from '../card.service';
import {AuthenticationBasicService} from '../../login-basic/authentication-basic.service';
import {PlayerService} from '../../user/player.service';
import {logger} from 'codelyzer/util/logger';
import { Sort } from 'angular4-hal-aot';
import {forEach} from '@angular/router/src/utils/collection';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit {
  public cards: Card[] = [];
  public totalCards = 0;
  public pageSize = 10;
  public page = 1;
  private sorting: Sort[] = [{ path: 'id', order: 'ASC' }];
  constructor(
    private cardService: CardService,
    private authenticationService: AuthenticationBasicService,
    private playerService: PlayerService,
    private http: HttpClient) {
  }

  ngOnInit() {
      if (!this.authenticationService.isAdmin()) {
        this.playerService.findByUsernameContaining(this.authenticationService.getCurrentUser().username)
          .subscribe((player) => {
            this.http.get<Card>(player[0]._links.card.href).subscribe((card) => {
              this.cards = [card];
              this.totalCards = this.cards.length;
            });
          });
      } else {
        this.cardService.getAll({size: this.pageSize, sort: this.sorting})
          .subscribe((cards) => {
            this.cards = cards;
            for (let i = 0, len = this.cards.length; i < len; i++) {
              this.playerService.findByCard(this.cards[i].uri)
                .subscribe(player => this.cards[i].player = player[0]);
            }
            this.totalCards = this.cardService.totalElement();
          });
      }
  }

  changePage() {
    this.cardService.page(this.page - 1).subscribe(
      (cards: Card[]) => this.cards = cards);
  }

  showSearchResults(cards) {
    this.cards = cards;
  }

}
