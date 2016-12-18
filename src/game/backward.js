import {PUSH_X} from './constants';
import isDucking from './is_ducking';
import updatePlayer from './update_player';

export default () => (world) => {
  const { player } = world;

  return isDucking(player) ? world : { ...world, player: updatePlayer({ ...player, ax: -PUSH_X }) };
};
