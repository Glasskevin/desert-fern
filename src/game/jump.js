import isGrounded from './is_grounded';
import isDucking from './is_ducking';
import updatePlayer from './update_player';

const MAX_AIR_JUMP_COUNT = 5;

const JumpVelocity = {
  GROUND: -7,
  AIR: -5,
};

const jumpVy = (player) => {
  if (player.airJumpCount >= MAX_AIR_JUMP_COUNT) return player.vy;
  if (isGrounded(player)) return JumpVelocity.GROUND;
  if (player.y > player.height) return JumpVelocity.AIR;
  return player.vy;
};

export default () => (world) => {
  const { player } = world;

  return isDucking(player) ? world : {
    ...world,
    player: updatePlayer({
      ...player,
      vy: jumpVy(player),
      airJumpCount: isGrounded(player) ? 0 : player.airJumpCount + 1,
    }),
  };
};
