import collide from 'box-collide';
import updatePlayer from './update_player';

export default () => (world) => {
  const { player, waters } = world;

  return {
     ...world,
    player: updatePlayer(player),
    waters: waters.filter((water) => !collide(player, water)),
  };
};
