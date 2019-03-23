Enabled

```js
const Stop = require('./assets/stop.svg');
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
    icon={<img src={Stop} />}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e3"
    icon={<img src={Stop} />}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e2"
    icon={<img src={Stop} />}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e1"
    icon={<img src={Stop} />}
    onClick={() => console.log('click')}
    disabled={false}
  />
  <IconButton
    elevation="e0"
    icon={<img src={Stop} />}
    onClick={() => console.log('click')}
    disabled={false}
  />
</Row>
```

Disabled

```js
const Stop = require('./assets/stop.svg');

<IconButton
  elevation="e3"
  icon={<img src={Stop} />}
  onClick={() => console.log('click')}
  disabled={true}
/>
```
