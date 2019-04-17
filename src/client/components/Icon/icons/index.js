// @flow
import add from './Add';
import check from './Check';
import chevron from './Chevron';
import remove from './Remove';
import edit from './Edit';
import replay from './Replay';
import stop from './Stop';
import terminal from './Terminal';
import play from './Play';
import search from './Search';
import clear from './Clear';
import dependency from './Dependency';
import scripts from './Scripts';
import settings from './Settings';
import update from './Update';
import arrow from './Arrow';
import git from './Git';

const icons = {
  add,
  check,
  chevron,
  remove,
  edit,
  replay,
  stop,
  terminal,
  play,
  search,
  clear,
  dependency,
  scripts,
  settings,
  update,
  arrow,
  git
};

export type Icon = $Keys<typeof icons>;
export default icons;
