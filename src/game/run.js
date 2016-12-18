import isDucking from './is_ducking';
import updatePlayer from './update_player';

const RUNNING_SPEED_LIMIT = 7;

export default () => (world) => {
  const { player } = world;

  return isDucking(player)
    ? world
    : { ...world, player: updatePlayer({ ...player, speedLimit: RUNNING_SPEED_LIMIT }) };
};
