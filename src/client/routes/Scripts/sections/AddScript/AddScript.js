// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import {
  withScriptsContext,
  type ScriptsContextProps
} from '~/context/ScriptsContext';
import {
  withSocketContext,
  type SocketContextProps
} from '~/context/SocketContext';

import { FAB, Modal, TextField, Spacing, Button } from '~/components';

import Add from '../../assets/add.svg';

const FABHolder = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

type Props = SocketContextProps & ScriptsContextProps;

type State = {
  modalIsActive: boolean,
  // keep track of whether form has been submitted at least once so
  // we only show form errors after user has at least submitted once
  submitted: boolean,
  scriptName: string,
  scriptCommand: string
};

class AddScript extends Component<Props, State> {
  static defaultProps = {};

  state = {
    modalIsActive: false,
    submitted: false,
    scriptName: '',
    scriptCommand: ''
  };

  handleFabClick = () => {
    this.setState(prevState => ({
      modalIsActive: !prevState.modalIsActive
    }));
  };

  handleModalRequestClose = () => {
    this.setState({
      modalIsActive: false,
      scriptName: '',
      scriptCommand: '',
      submitted: false
    });
  };

  handleInputChange = (
    property: 'scriptName' | 'scriptCommand',
    value: string
  ) => {
    this.setState({
      [property]: value
    });
  };

  handleSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault();

    this.setState({
      submitted: true
    });

    if (!this.state.scriptName || !this.state.scriptCommand) {
      return;
    }

    this.addScript();
  };

  addScript = () => {
    this.props
      .addScript({
        name: this.state.scriptName,
        command: this.state.scriptCommand
      })
      .then(() => {
        console.log('new script!');
        this.handleModalRequestClose();
      })
      .catch(() => {
        // handle error case
      });
  };

  render() {
    return (
      <FABHolder>
        <FAB
          icon={<img src={Add} />}
          label="Add script"
          onClick={this.handleFabClick}
        />
        <Modal
          isActive={this.state.modalIsActive}
          onRequestClose={this.handleModalRequestClose}
          title="Add script"
          renderWrapper={children => (
            <Form onSubmit={this.handleSubmit}>{children}</Form>
          )}
          renderBody={() => (
            <Fragment>
              <TextField
                label="Script Name"
                fullWidth
                font={"'Roboto Mono',monospace"}
                errorText="This is a required field"
                error={this.state.scriptName.length < 1 && this.state.submitted}
                value={this.state.scriptName}
                onChange={this.handleInputChange.bind(null, 'scriptName')}
              />
              <Spacing top="xs" />
              <TextField
                label="Script command(s)"
                multiline
                fullWidth
                rows={4}
                font={"'Roboto Mono',monospace"}
                errorText="This is a required field"
                error={
                  this.state.scriptCommand.length < 1 && this.state.submitted
                }
                value={this.state.scriptCommand}
                onChange={this.handleInputChange.bind(null, 'scriptCommand')}
              />
            </Fragment>
          )}
          renderFooter={() => (
            <Fragment>
              <Button type="ghost" onClick={this.handleModalRequestClose}>
                Cancel
              </Button>
              <Spacing left="sm" />
              <Button type="primary" submit>
                Add Script
              </Button>
            </Fragment>
          )}
        />
      </FABHolder>
    );
  }
}

export default withScriptsContext(withSocketContext(AddScript));
