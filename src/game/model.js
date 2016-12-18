import {GAME_WIDTH, GAME_HEIGHT, PLAYER_HEIGHT, WALKING_SPEED_LIMIT} from './constants';

const WATER_SIZE = 5;
const PLAYER_WIDTH = 10;
const GRAVITY = 0.3;

const makeWater = (x, y) => ({ x, y, width: WATER_SIZE, height: WATER_SIZE });

export default {
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
  waters: [makeWater(0, 0), makeWater(0, GAME_HEIGHT - WATER_SIZE), makeWater(GAME_WIDTH - 10, 0)],
};
