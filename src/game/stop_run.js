import {WALKING_SPEED_LIMIT} from './constants';
import updatePlayer from './update_player';

export default () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: updatePlayer({
      ...player,
      speedLimit: WALKING_SPEED_LIMIT,
    }),
  };
};
