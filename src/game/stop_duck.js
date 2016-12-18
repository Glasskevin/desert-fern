import {PLAYER_HEIGHT, WALKING_SPEED_LIMIT} from './constants';
import updatePlayer from './update_player';

export default () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: updatePlayer({
      ...player,
      y: player.y + player.height - PLAYER_HEIGHT,
      height: PLAYER_HEIGHT,
      speedLimit: WALKING_SPEED_LIMIT,
    }),
  };
};
