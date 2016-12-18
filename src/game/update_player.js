import {GAME_WIDTH, GAME_HEIGHT} from './constants';
import isGrounded from './is_grounded';
import isDucking from './is_ducking';

const Friction = {
  AIR: 1 / 1.25,
  GROUND: 1 / 1.55,
  DUCKING_AIR: 1 / 1.01,
  DUCKING_GROUND: 1 / 1.05,
};

const inBounds = (value, min, max) => Math.min(max, Math.max(min, value));

const getFriction = (player) => {
  if (isDucking(player)) {
    return isGrounded(player) ? Friction.DUCKING_GROUND : Friction.DUCKING_AIR;
  }

  return isGrounded(player) ? Friction.GROUND : Friction.AIR;
};

const updateVx = (player, time) => {
  const boundedVx = inBounds(player.vx  + player.ax * time, -player.speedLimit, player.speedLimit);
  const vx = boundedVx * getFriction(player);

  if (player.x <= 0 && vx <= 0) return 0;
  if (player.x >= GAME_WIDTH && vx >= 0) return 0;
  return vx;
};

const updateVy = (player, time) =>
  (isGrounded(player) ? Math.min(0, player.vy) : player.vy) + player.ay * time;

export default (player, time=1) => {
  const vx = updateVx(player, time);
  const vy = updateVy(player, time);

  return {
    ...player,
    x: inBounds(player.x + vx * time, 0, GAME_WIDTH),
    y: Math.min(GAME_HEIGHT - player.height, player.y + vy * time),
    vx,
    vy,
  };
};
