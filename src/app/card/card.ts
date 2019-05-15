import { Resource } from 'angular4-hal-aot';
import { PlayerService } from '../user/player.service';

export class Card extends Resource {
  rows: number;
  cols: number;
  uri: string;
  id: number;
  numbers: number[][];
  // game: Game;
  username: string;

  constructor(values: object = {}) {
    super();
    Object.assign(this as any, values);
  }
}
