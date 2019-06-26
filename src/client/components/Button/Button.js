import { withThemeMode } from '../../context/ThemeContext';

import DefaultButton from './default';
import PlayfulButton from './playful';

export default withThemeMode({
  default: DefaultButton,
  playful: PlayfulButton
});
