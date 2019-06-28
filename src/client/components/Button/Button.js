import { withThemeMode } from '../../context/ThemeContext';

import DefaultButton from './default';
import RetroButton from './retro';

export default withThemeMode({
  default: DefaultButton,
  retro: RetroButton
});
