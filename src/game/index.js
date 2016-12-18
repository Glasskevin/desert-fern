import {GAME_WIDTH, GAME_HEIGHT} from './constants';
import intent from './intent';
import model from './model';
import view from './view';

export const WIDTH = GAME_WIDTH;
export const HEIGHT = GAME_HEIGHT;

const update = (world, action) => action(world);

export default (sources) => ({
  canvas: intent(sources).fold(update, model).map(view),
});
