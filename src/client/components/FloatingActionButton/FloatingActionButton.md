```js
const styled = require('styled-components').default;
const icon = require('./assets/add.svg');

<FAB
  onClick={() => alert('click')}
  icon={<img src={icon} />}
  label="Add to cart" 
/>
```