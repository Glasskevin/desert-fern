import xs from 'xstream';
import jump from './jump';
import duck from './duck';
import backward from './backward';
import forward from './forward';
import run from './run';
import stopDuck from './stop_duck';
import stopVx from './stop_vx';
import stopRun from './stop_run';
import tick from './tick';

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
  const releaseVxInput$ = xs.merge(stopBackwardInput$, stopForwardInput$);
  const numVxInput$ = 
    xs.merge(backwardInput$.mapTo(1), forwardInput$.mapTo(1), releaseVxInput$.mapTo(-1))
      .fold((a, b) => a + b, 0)
      .filter((n) => n <= 0);
  const stopVxInput$ = numVxInput$.mapTo(releaseVxInput$).flatten();

  return xs.merge(
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
};
