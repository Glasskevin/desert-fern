import {GAME_WIDTH, GAME_HEIGHT, MAP_COLUMN_COUNT} from './constants';
import updatePlayer from './update_player';

const FRAME_RATE = 1000 / 60;

const updateMap = ({ map, player }) => {
  const playerCol = Math.floor(player.x * MAP_COLUMN_COUNT / GAME_WIDTH);
  const tileHeight = GAME_HEIGHT * MAP_COLUMN_COUNT / map.length;
  const playerRow = Math.floor(player.y / tileHeight);
  const mapIdx = playerRow * MAP_COLUMN_COUNT + playerCol;

  switch (map[mapIdx]) {
    case 1: map[mapIdx] = 0; break;
  }

  return map;
};

export default ({ delta }) => (world) => {
  const { player } = world;
  const updatedPlayer = updatePlayer(player, delta / FRAME_RATE);

  return {
    ...world,
    map: updateMap(world),
    player: updatedPlayer,
  };
};
