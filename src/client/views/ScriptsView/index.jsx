import React, { Component } from 'react';
import styled from 'styled-components';

import SectionTitle from '../../components/common/SectionTitle';
import NewScript from '../../components/NewScript';
import Shell from '../../components/Shell';

const ScriptsContainer = styled.div``;

class ScriptsView extends Component {
  parseScripts() {
    let scriptsArr = [];

    if (this.props.package.scripts) {
      let { scripts } = this.props.package;

      for (let key of Object.keys(scripts)) {
        scriptsArr.push({
          name: key,
          raw: scripts[key]
        });
      }
    }
    return scriptsArr;
  }

  render() {
    return (
      <React.Fragment>
        <SectionTitle>Scripts</SectionTitle>
        <NewScript />
        <ScriptsContainer>
          {this.parseScripts().map(scriptObj => (
            <Shell script={scriptObj} key={scriptObj.name} />
          ))}
        </ScriptsContainer>
      </React.Fragment>
    );
  }
}

export default ScriptsView;
