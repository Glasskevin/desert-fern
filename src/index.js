import {run} from '@cycle/xstream-run';
import {makeCanvasDriver} from 'cycle-canvas';
import {makeAnimationDriver} from 'cycle-animation-driver';
import keyDriver from './key-driver';
import game, {WIDTH, HEIGHT} from './game';

run(game, {
  animation: makeAnimationDriver(),
  canvas: makeCanvasDriver(null, { width: WIDTH, height: HEIGHT }),
  key: keyDriver,
});
