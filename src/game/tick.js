import collide from 'box-collide';
import updatePlayer from './update_player';

const FRAME_RATE = 1000 / 60;

export default ({ delta }) => (world) => {
  const { player, waters } = world;

  return {
     ...world,
    player: updatePlayer(player, delta / FRAME_RATE),
    waters: waters.filter((water) => !collide(player, water)),
  };
};
