import updatePlayer from './update_player';

export default () => (world) => {
  const { player } = world;

  return { ...world, player: updatePlayer({ ...player, ax: 0 }) };
};
