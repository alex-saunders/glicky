// @flow
import React, { Component, Fragment } from 'react';
import { PoseGroup } from 'react-pose';

import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';

import {
  Subtitle,
  Button,
  SkeletonScreen,
  Icon,
  Spacing,
  Spinner,
  Text
} from '~/components';

import type { Package, Dependency } from '../../../../../../types';

import { Description, Version } from './sections';

import {
  BodyWrapper,
  PanelBody,
  StyledExpansionPanel,
  InfoSection,
  Fade,
  PanelFooter,
  IconHolder,
  UpdateIcon,
  RepoLink,
  RepoIcon
} from './DependencyPanel.styles';

type State = {
  panelActive: boolean,
  packageInfo?: Package,
  installedVersion?: ?string,
  isFetchingPackageInfo: boolean,
  isUpdating: boolean
};

type Props = SocketContextProps & {
  dependency: Dependency,
  active: boolean,
  renderTitle: () => void,
  installedVersion: ?string,
  className?: string,
  onRequestDelete: () => {},
  onRequestUpdate: Dependency => Promise<Dependency>
};

class DependencyPanel extends Component<Props, State> {
  static defaultProps = {};

  state = {
    panelActive: false,
    isFetchingPackageInfo: true,
    isUpdating: false
  };

  body: ?HTMLDivElement;

  static getDerivedStateFromProps(nextProps: Props) {
    return {
      installedVersion: nextProps.installedVersion,
      panelActive: nextProps.active
    };
  }

  handlePanelTransitionEnd = () => {
    if (this.state.panelActive && !this.state.packageInfo) {
      this.fetchPackageInfo();
    }
  };

  handleClickUpdate = () => {
    this.setState(
      {
        isUpdating: true
      },
      () => {
        this.props.onRequestUpdate(this.props.dependency).then(() => {
          this.setState({
            installedVersion: null,
            isUpdating: false
          });
        });
      }
    );
  };

  fetchPackageInfo() {
    const { socket, dependency } = this.props;

    socket.emit(
      'request',
      {
        resource: 'package-info',
        name: dependency.name
      },
      info => {
        this.setState(
          {
            packageInfo: info,
            isFetchingPackageInfo: false
          },
          () => {
            this.setState({});
          }
        );
      }
    );
  }

  renderDependencyInfo() {
    const packageInfo = this.state.packageInfo || false;

    console.log(packageInfo);

    return (
      <div>
        <InfoSection>
          <Subtitle>Description</Subtitle>
          {packageInfo ? (
            <Fade>
              <Description
                description={packageInfo.description}
                keywords={packageInfo.keywords}
              />
            </Fade>
          ) : (
            <Fragment>
              <SkeletonScreen width={5} absoluteWidth={384} />
              <Spacing top="xs" />
              <SkeletonScreen width={4.5} absoluteWidth={271} />
            </Fragment>
          )}
        </InfoSection>
        <InfoSection>
          <Subtitle>Version</Subtitle>
          {packageInfo ? (
            <Fade>
              <Version
                installedVersion={this.state.installedVersion || null}
                latestVersion={packageInfo.version}
                publishDate={packageInfo.time}
                publisher={packageInfo.author}
              />
            </Fade>
          ) : (
            <Fragment>
              <SkeletonScreen width={5.4} absoluteWidth={510} />
              <Spacing top="xs" />
              <SkeletonScreen width={5} absoluteWidth={390} />
              <Spacing top="xs" />
              <SkeletonScreen width={5.2} absoluteWidth={450} />
            </Fragment>
          )}
        </InfoSection>

        <InfoSection>
          <Subtitle>{'Repository'}</Subtitle>
          {packageInfo ? (
            packageInfo.repository && (
              <Fade>
                <RepoLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={packageInfo.repository.url}
                >
                  <RepoIcon>
                    <Icon type="git" />
                  </RepoIcon>
                  <Text size="sm1" colour="text_secondary">
                    Github
                  </Text>
                </RepoLink>
              </Fade>
            )
          ) : (
            <Fragment>
              <SkeletonScreen width={4} absoluteWidth={195} />
              <Spacing top="xs" />
              <SkeletonScreen width={4.3} absoluteWidth={240} />
            </Fragment>
          )}
        </InfoSection>
      </div>
    );
  }

  render() {
    const { className, onRequestDelete } = this.props;
    const { panelActive } = this.state;

    return (
      <StyledExpansionPanel
        active={panelActive}
        onTransitionEnd={this.handlePanelTransitionEnd}
        className={className}
        renderTitle={() => this.props.renderTitle()}
        duration={0.3}
      >
        {() => (
          <BodyWrapper ref={div => (this.body = div)}>
            <PanelBody>{this.renderDependencyInfo()}</PanelBody>
            <PanelFooter>
              {this.props.dependency.outdated && (
                <Fade>
                  <Button
                    type="primary"
                    icon={
                      <PoseGroup>
                        {this.state.isUpdating ? (
                          <IconHolder key="updatingDependency">
                            <Spinner size="md" colour="white" lineWidth={3} />
                          </IconHolder>
                        ) : (
                          <IconHolder key="notUpdatingDependency">
                            <UpdateIcon />
                          </IconHolder>
                        )}
                      </PoseGroup>
                    }
                    onClick={this.handleClickUpdate}
                  >
                    Update
                  </Button>
                </Fade>
              )}
              <Fade>
                <Button type="error" icon={'remove'} onClick={onRequestDelete}>
                  Remove
                </Button>
              </Fade>
            </PanelFooter>
          </BodyWrapper>
        )}
      </StyledExpansionPanel>
    );
  }
}

export default withSocketContext(DependencyPanel);
