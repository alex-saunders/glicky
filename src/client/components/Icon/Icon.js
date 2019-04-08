// @flow
import React from 'react';
import icons, { type Icon as IconType } from './icons';

export type { IconType };

type Props = {
  type: IconType
};

const Icon = ({ type, ...props }: Props) => {
  const Svg = icons[type];

  if (!Svg) {
    return null;
  }

  return <Svg {...props} />;
};

export default Icon;
