// @flow
import React from 'react';
import md5 from 'md5';

import { Wrapper, Placeholder, Img } from './Avatar.styles.js';

type Props = {
  type: 'gravatar' | 'raw',
  source: string
};

type State = {
  fetching: boolean,
  url?: string
};

class Avatar extends React.Component<Props, State> {
  static defaultProps = {};

  state = {
    fetching: true
  };

  componentDidMount() {
    const img = new Image();
    img.onload = () => {
      this.setState({
        fetching: false,
        url
      });
    };

    const url = this.getImageUrl();
    img.src = url;
  }

  getImageUrl(): string {
    const { type, source } = this.props;
    if (type === 'gravatar') {
      const hash = md5(source.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}?s=50`;
    }
    return source;
  }

  render() {
    const { fetching } = this.state;

    return (
      <Wrapper>
        <Placeholder />
        {!fetching && this.state.url && <Img src={this.state.url} />}
      </Wrapper>
    );
  }
}

export default Avatar;
