import {rect} from 'cycle-canvas';
import {GAME_WIDTH, GAME_HEIGHT, MAP_COLUMN_COUNT} from './constants';

const WATER_SIZE = 5;

const renderSprite = (sprite, fill) => rect({ ...sprite, draw: [{ fill }]});

const renderTile = (tile, i, map) => {
  const row = Math.floor(i / MAP_COLUMN_COUNT);
  const col = i - row * MAP_COLUMN_COUNT;
  const x = col * GAME_WIDTH / MAP_COLUMN_COUNT;
  const tileHeight = GAME_HEIGHT * MAP_COLUMN_COUNT / map.length;
  const y = row * GAME_HEIGHT / tileHeight;

  switch (tile) {
    case 1:
      return renderSprite({ x, y, width: WATER_SIZE, height: WATER_SIZE },
        'blue');
    default: return null;
  }
};

export default ({ map, player }) => {
  const playerSprite = renderSprite(player, 'green');
  const mapSprites = map.map(renderTile).filter((t) => t);

  return rect({ draw: [{ fill: 'khaki' }] }, [...mapSprites, playerSprite]);
};
