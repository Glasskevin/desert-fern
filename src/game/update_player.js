import {GAME_WIDTH, GAME_HEIGHT} from './constants';
import isGrounded from './is_grounded';
import isDucking from './is_ducking';

const Friction = {
  AIR: 1 / 1.25,
  GROUND: 1 / 1.55,
  DUCKING_AIR: 1 / 1.01,
  DUCKING_GROUND: 1 / 1.05,
};

const getFriction = (player) => {
  if (isDucking(player)) {
    return isGrounded(player) ? Friction.DUCKING_GROUND : Friction.DUCKING_AIR;
  }

  return isGrounded(player) ? Friction.GROUND : Friction.AIR;
};

export default (player) => {
  const vx = Math.min(player.speedLimit,
    Math.max(-player.speedLimit, (player.vx  + player.ax) * getFriction(player)));
  const vy = (isGrounded(player) ? Math.min(0, player.vy) : player.vy) + player.ay;

  return {
    ...player,
    x: Math.min(GAME_WIDTH, Math.max(0, player.x + vx)),
    y: Math.min(GAME_HEIGHT - player.height, player.y + vy),
    vx,
    vy,
  };
};
