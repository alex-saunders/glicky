// @flow
import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';

import {
  withSettings,
  type SettingsContextProps
} from '~/context/SettingsContext';
import { withTheme, type ThemeContextProps } from '~/context/ThemeContext';

import { type ThemeProps } from '~/theme';
import { primaryColours } from '~/theme/colours';

import {
  Title,
  Subtitle,
  Toggle,
  BodyText,
  ExpansionPanel,
  ColourPicker
} from '~/components';

const Wrapper = posed.div({
  routeEnter: {
    opacity: 1,
    staggerChildren: 10,
    delay: 300,
    delayChildren: 250
  },
  routeExit: { opacity: 0 }
});

const Section = posed.div({
  routeEnter: { y: 0, opacity: 1 },
  routeExit: { y: 50, opacity: 0 }
});

const Container = styled.div`
  margin: ${(p: ThemeProps) => p.theme.sizing('md')} 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 ${(p: ThemeProps) => p.theme.sizing('sm')} 0;
`;

const BodyTextDetail = styled(BodyText)`
  display: inline-block;
  margin-top: ${(p: ThemeProps) => p.theme.sizing('xxs')};
`;

type Props = ThemeContextProps & SettingsContextProps;

type State = {};

class Settings extends Component<Props, State> {
  static defaultProps = {};

  state = {};

  handleThemeToggle = active => {
    this.props.setSettings({
      dark: active
    });
  };

  handleThemeColourChange = colour => {
    this.props.setSettings({
      primaryColour: colour
    });
  };

  handleDependenciesCheckToggle = active => {
    this.props.setSettings({
      dependenciesCheckOnStartup: active
    });
  };

  handleFilterDependenciesToggle = active => {
    this.props.setSettings({
      filterOutdatedDependencies: active
    });
  };

  render() {
    const { settings } = this.props;

    if (!settings) {
      return null;
    }

    return (
      <Wrapper>
        <Section>
          <Title>settings</Title>
        </Section>
        <Container>
          <Section>
            <Row>
              <Subtitle>General</Subtitle>
            </Row>
          </Section>
          <Section>
            <Row>
              <BodyText>{'Dark Mode'}</BodyText>
              <Toggle
                selected={settings.dark}
                onChange={this.handleThemeToggle}
              />
            </Row>
          </Section>

          <Section>
            <ExpansionPanel
              active={this.props.theme.mode === 'light'}
              renderTitle={() => ''}
            >
              {() => (
                <Row>
                  <BodyText>
                    {'Primary Theme Colour'}
                    <br />
                    <BodyTextDetail>
                      {'(Only available in light mode)'}
                    </BodyTextDetail>
                  </BodyText>
                  <ColourPicker
                    // $FlowFixMe: flow cannot interpret the result of Object.values as just strings
                    colours={Object.values(primaryColours)}
                    value={settings.primaryColour}
                    onChange={this.handleThemeColourChange}
                  />
                </Row>
              )}
            </ExpansionPanel>
          </Section>

          <Section>
            <Row>
              <Subtitle>Dependencies</Subtitle>
            </Row>
          </Section>
          <Section>
            <Row>
              <BodyText>
                {'Check for outdated dependencies on startup'}
                <br />
                <BodyTextDetail>
                  {
                    "(If off, this check will only be performed when opening the 'dependencies' tab)"
                  }
                </BodyTextDetail>
              </BodyText>
              <Toggle
                selected={settings.dependenciesCheckOnStartup}
                onChange={this.handleDependenciesCheckToggle}
              />
            </Row>
          </Section>
          <Section>
            <Row>
              <BodyText>{'Only show outdated dependencies'}</BodyText>
              <Toggle
                selected={settings.filterOutdatedDependencies}
                onChange={this.handleFilterDependenciesToggle}
              />
            </Row>
          </Section>
        </Container>
      </Wrapper>
    );
  }
}

export default withSettings(withTheme(Settings));
