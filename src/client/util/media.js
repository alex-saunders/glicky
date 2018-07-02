import { css } from 'styled-components';

const sizes = {
  desktop: 1100,
  tablet: 768,
  mobile: 376
};

const media = {
  desktop: (...args) => css`
    @media (min-width: ${sizes['desktop']}px) {
      ${css(...args)};
    }
  `,
  tablet: (...args) => css`
    @media (min-width: ${sizes['tablet']}px) and (max-width: ${sizes[
        'desktop'
      ]}px) {
      ${css(...args)};
    }
  `,
  mobile: (...args) => css`
    @media (max-width: ${sizes['tablet']}px) {
      ${css(...args)};
    }
  `
};

export default media;
