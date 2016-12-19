import {GAME_WIDTH, GAME_HEIGHT, PLAYER_HEIGHT, WALKING_SPEED_LIMIT} from './constants';

const PLAYER_WIDTH = 10;
const GRAVITY = 0.3;

export default {
  map: [1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
  player: {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: GRAVITY,
    airJumpCount: 0,
    speedLimit: WALKING_SPEED_LIMIT,
  },
};
