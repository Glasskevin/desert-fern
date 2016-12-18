import updatePlayer from './update_player';

const DUCKING_PLAYER_HEIGHT = 10;

export default () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: updatePlayer({
      ...player,
      y: player.y + player.height - DUCKING_PLAYER_HEIGHT,
      height: DUCKING_PLAYER_HEIGHT,
    }),
  };
};
