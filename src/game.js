import collide from 'box-collide';
import xs from 'xstream';
import {rect} from 'cycle-canvas';

export const WIDTH = 500;
export const HEIGHT = 200;
const PLAYER_SIZE = 10;
const WATER_SIZE = 5;
const GROUND_JUMP_VELOCITY = -6;
const AIR_JUMP_VELOCITY = -2.5;
const SPEED_LIMIT = 8;
const GRAVITY = 0.3;
const AIR_FRICTION = 1 / 1.25;
const GROUND_FRICTION = 1 / 1.55;
const PUSH_X = 5;

const defaultUpdateVx = ({ y, height, vx }) =>
  vx * (y + height >= HEIGHT ? GROUND_FRICTION : AIR_FRICTION);

const defaultUpdateVy = ({ vy }) => vy + GRAVITY;

const makeWater = (x, y) => ({ x, y, width: WATER_SIZE, height: WATER_SIZE });

const initialWorld = {
  player: {
    x: WIDTH / 2,
    y: HEIGHT - PLAYER_SIZE,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    vx: 0,
    vy: 0,
    updateVx: defaultUpdateVx,
    updateVy: defaultUpdateVy,
  },
  waters: [makeWater(0, 0), makeWater(0, HEIGHT - WATER_SIZE), makeWater(WIDTH - 10, 0)],
};

const jump = () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: {
      ...player,
      updateVy({ y, vy }) {
        if (y + PLAYER_SIZE >= HEIGHT) return GROUND_JUMP_VELOCITY;
        if (y > PLAYER_SIZE) return AIR_JUMP_VELOCITY;
        return vy;
      },
    },
  };
};

const stopVy = () => (world) => {
  const { player } = world;

  return { ...world, player: { ...player, updateVy: defaultUpdateVy }};
};

const backward = () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: {
      ...player,
      updateVx(player) {
        const { vx } = player;
        return defaultUpdateVx({ ...player, vx: Math.max(-SPEED_LIMIT, player.vx - PUSH_X) });
      },
    },
  };
};

const forward = () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: {
      ...player,
      updateVx(player) {
        const { vx } = player;
        return defaultUpdateVx({ ...player, vx: Math.min(SPEED_LIMIT, player.vx + PUSH_X) });
      },
    },
  };
};

const stopVx = () => (world) => {
  const { player } = world;

  return { ...world, player: { ...player, updateVx: defaultUpdateVx }};
};

const tick = () => (world) => {
  const { player, waters } = world;

  return {
     ...world,
    player: {
      ...player,
      x: Math.min(WIDTH, Math.max(0, player.x + player.vx)),
      y: Math.min(HEIGHT - player.height, player.y + player.vy),
      vx: player.updateVx(player),
      vy: player.updateVy(player),
    },
    waters: waters.filter((water) => !collide(player, water)),
  };
};

const renderSprite = (sprite, fill) => rect({ ...sprite, draw: [{ fill }]});

const view = ({ player, waters }) => {
  const playerSprite = renderSprite(player, 'green');
  const waterSprites = waters.map((water) => renderSprite(water, 'blue'));

  return rect({ draw: [{ fill: 'khaki' }] }, [playerSprite, ...waterSprites]);
};

export default ({ animation, key }) => {
  const jumpInput$ = key.down('w');
  const backwardInput$ = key.down('a');
  const forwardInput$ = key.down('d');
  const stopBackwardInput$ = key.up('a');
  const stopForwardInput$ = key.up('d');
  const vxInput$ = xs.merge(backwardInput$, forwardInput$);
  const releaseVxInput$ = xs.merge(stopBackwardInput$, stopForwardInput$);
  const numVxInput$ = xs.combine(vxInput$.mapTo(1), releaseVxInput$.mapTo(-1))
    .map(([a, b]) => a + b)
    .filter((n) => n <= 0);
  const stopVxInput$ = numVxInput$.mapTo(releaseVxInput$).flatten();
  const stopVyInput$ = key.up('w');

  const action$ = xs.merge(
    animation.map(tick),
    jumpInput$.map(jump),
    backwardInput$.map(backward),
    forwardInput$.map(forward),
    stopVxInput$.map(stopVx),
    stopVyInput$.map(stopVy)
  );

  return {
    canvas: action$.fold((world, action) => action(world), initialWorld).map(view),
  };
};
