// @flow
import { Component } from 'react';

import { type LocationType } from '@reach/router';

type Props = {
  scrollToTop: () => void,
  location: LocationType
};

// We could potentially extend this class to restore scroll positions per route
// see: https://twitter.com/ryanflorence/status/1029121580855488512?lang=en
class ManageScroll extends Component<Props, {}> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.key !== this.props.location.key) {
      this.props.scrollToTop();
    }
  }

  render() {
    return null;
  }
}

export default ManageScroll;
