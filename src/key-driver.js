import fromEvent from 'xstream/extra/fromEvent';
import keycode from 'keycode';

const isKey = (key) => ({ keyCode }) => keycode(key) === keyCode;

export default () => {
  const keydown$ = fromEvent(document, 'keydown');
  const keyup$ = fromEvent(document, 'keyup');

  return {
    down(key) {
      return keydown$.filter(isKey(key));
    },
    up(key) {
      return keyup$.filter(isKey(key));
    },
  };
};
