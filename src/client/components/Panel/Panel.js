// @flow
import styled from 'styled-components';
import type { ThemedComponent, ThemeProps, Elevation } from '../../theme';

type PanelProps = {
  /** elevation key from theme */
  elevation?: Elevation
};
const Panel: ThemedComponent<PanelProps> = styled.section`
  background: ${(p: ThemeProps) => p.theme.colour('background_panel')};
  border-radius: ${(p: ThemeProps) => p.theme.sizing(-1)};

  ${(p: PanelProps & ThemeProps) =>
    p.elevation ? p.theme.elevation(p.elevation) : p.theme.elevation('e1')};
`;

export default Panel;
