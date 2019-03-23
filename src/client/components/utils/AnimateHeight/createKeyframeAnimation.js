// @flow
// TODO: workerize this
import { keyframes } from 'styled-components';

export default function createKeyframeAnimation(targetHeight: number) {
  const ease = v => {
    // easeInOutQuint (https://gist.github.com/gre/1650294)
    // return v < 0.5 ? 16 * v * v * v * v * v : 1 + 16 * --v * v * v * v * v;

    // easeInOut (http://www.wolframalpha.com/input/?i=plot+1+-+((cos(pi*x)+%2B+1)+%2F+2)+for+x+in+(0,1))
    return 1 - (Math.cos(Math.PI * v) + 1) / 2;
  };

  // Figure out the size of the element when collapsed.
  let animation = '';
  let inverseAnimation = '';

  for (let step = 0; step <= 100; step++) {
    // Remap the step value to an eased one.
    let easedStep = ease((100 - step) / 100);
    // let easedStep = (100 - step) / 100;

    // Calculate the scale of the element.
    const yScale = targetHeight + (1 - targetHeight) * easedStep;

    animation += ` ${step}% {
      transform: scaleY(${yScale});
    }`;

    // And now the inverse for the contents.
    const invYScale = 1 / yScale;
    inverseAnimation += ` ${step}% {
      transform: scaleY(${invYScale});
    }`;
  }

  return {
    animation: keyframes`${animation}`,
    reverseAnimation: keyframes`${inverseAnimation}`
  };
}
