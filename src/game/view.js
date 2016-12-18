import {rect} from 'cycle-canvas';

const renderSprite = (sprite, fill) => rect({ ...sprite, draw: [{ fill }]});

export default ({ player, waters }) => {
  const playerSprite = renderSprite(player, 'green');
  const waterSprites = waters.map((water) => renderSprite(water, 'blue'));

  return rect({ draw: [{ fill: 'khaki' }] }, [playerSprite, ...waterSprites]);
};
