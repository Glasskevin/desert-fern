import collide from 'box-collide';
import xs from 'xstream';
import {rect} from 'cycle-canvas';

export const WIDTH = 500;
export const HEIGHT = 200;
const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 20;
const DUCKING_PLAYER_HEIGHT = 10;
const WATER_SIZE = 5;
const GROUND_JUMP_VELOCITY = -7;
const AIR_JUMP_VELOCITY = -5;
const WALKING_SPEED_LIMIT = 4;
const RUNNING_SPEED_LIMIT = 7;
const GRAVITY = 0.3;
const AIR_FRICTION = 1 / 1.25;
const GROUND_FRICTION = 1 / 1.55;
const DUCKING_AIR_FRICTION = 1 / 1.01;
const DUCKING_GROUND_FRICTION = 1 / 1.05;
const PUSH_X = 5;
const MAX_AIR_JUMP_COUNT = 5;

const makeWater = (x, y) => ({ x, y, width: WATER_SIZE, height: WATER_SIZE });

const initialWorld = {
  player: {
    x: WIDTH / 2,
    y: HEIGHT - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: GRAVITY,
    airJumpCount: 0,
    speedLimit: WALKING_SPEED_LIMIT,
  },
  waters: [makeWater(0, 0), makeWater(0, HEIGHT - WATER_SIZE), makeWater(WIDTH - 10, 0)],
};

const isGrounded = ({ y, height }) => y + height >= HEIGHT;

const isDucking = ({ height }) => height < PLAYER_HEIGHT;

const getFriction = (player) => {
  if (isDucking(player)) {
    return isGrounded(player) ? DUCKING_GROUND_FRICTION : DUCKING_AIR_FRICTION;
  }

  return isGrounded(player) ? GROUND_FRICTION : AIR_FRICTION;
};

const updatePlayer = (player) => {
  const vx = Math.min(player.speedLimit,
    Math.max(-player.speedLimit, (player.vx  + player.ax) * getFriction(player)));
  const vy = (isGrounded(player) ? Math.min(0, player.vy) : player.vy) + player.ay;

  return {
    ...player,
    x: Math.min(WIDTH, Math.max(0, player.x + vx)),
    y: Math.min(HEIGHT - player.height, player.y + vy),
    vx,
    vy,
  };
};

const jumpVy = (player) => {
  if (player.airJumpCount >= MAX_AIR_JUMP_COUNT) return player.vy;
  if (isGrounded(player)) return GROUND_JUMP_VELOCITY;
  if (player.y > player.height) return AIR_JUMP_VELOCITY;
  return player.vy;
};

const jump = () => (world) => {
  const { player } = world;

  return isDucking(player) ? world : {
    ...world,
    player: updatePlayer({
      ...player,
      vy: jumpVy(player),
      airJumpCount: isGrounded(player) ? 0 : player.airJumpCount + 1,
    }),
  };
};

const duck = () => (world) => {
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

const backward = () => (world) => {
  const { player } = world;

  return isDucking(player) ? world : { ...world, player: updatePlayer({ ...player, ax: -PUSH_X }) };
};

const forward = () => (world) => {
  const { player } = world;

  return isDucking(player) ? world : { ...world, player: updatePlayer({ ...player, ax: PUSH_X }) };
};

const run = () => (world) => {
  const { player } = world;

  return isDucking(player)
    ? world
    : { ...world, player: updatePlayer({ ...player, speedLimit: RUNNING_SPEED_LIMIT }) };
};

const stopDuck = () => (world) => {
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

const stopVx = () => (world) => {
  const { player } = world;

  return { ...world, player: updatePlayer({ ...player, ax: 0 }) };
};

const stopRun = () => (world) => {
  const { player } = world;

  return {
    ...world,
    player: updatePlayer({
      ...player,
      speedLimit: WALKING_SPEED_LIMIT,
    }),
  };
};

const tick = () => (world) => {
  const { player, waters } = world;

  return {
     ...world,
    player: updatePlayer(player),
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
  const duckInput$ = key.down('s');
  const backwardInput$ = key.down('a');
  const forwardInput$ = key.down('d');
  const runInput$ = key.down('shift');
  const stopDuckInput$ = key.up('s');
  const stopBackwardInput$ = key.up('a');
  const stopForwardInput$ = key.up('d');
  const stopRunInput$ = key.up('shift');
  const vxInput$ = xs.merge(backwardInput$, forwardInput$);
  const releaseVxInput$ = xs.merge(stopBackwardInput$, stopForwardInput$);
  const numVxInput$ = xs.combine(vxInput$.mapTo(1), releaseVxInput$.mapTo(-1))
    .map(([a, b]) => a + b)
    .filter((n) => n <= 0);
  const stopVxInput$ = numVxInput$.mapTo(releaseVxInput$).flatten();

  const action$ = xs.merge(
    animation.map(tick),
    jumpInput$.map(jump),
    duckInput$.map(duck),
    backwardInput$.map(backward),
    forwardInput$.map(forward),
    runInput$.map(run),
    stopDuckInput$.map(stopDuck),
    stopVxInput$.map(stopVx),
    stopRunInput$.map(stopRun)
  );

  return {
    canvas: action$.fold((world, action) => action(world), initialWorld).map(view),
  };
};
