Enabled

```js
const styled = require('styled-components').default;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  & > * {
    margin: 0 8px;
  }
`;
<Row>
  <IconButton
    elevation="e4"
    icon={'stop'}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e3"
    icon={'stop'}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e2"
    icon={'stop'}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e1"
    icon={'stop'}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e0"
    icon={'stop'}
    onClick={() => console.log('click')}
    disabled={false}
  />
</Row>
```

Disabled

```js

<IconButton
  elevation="e3"
  icon={'stop'}
  onClick={() => console.log('click')}
  disabled={true}
/>
```
