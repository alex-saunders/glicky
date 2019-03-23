```js
const styled = require('styled-components').default;

const items = [
  {
    key: 1,
    content: '1'
  },
  {
    key: 2,
    content: '2'
  },
  {
    key: 3,
    content: '3'
  },
  {
    key: 4,
    content: '4'
  },
  {
    key: 5,
    content: '5'
  },
]

const Item = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
`;

<Grid
  spacing="xs"
  items={items}
  itemKey={(item) => item.key}
  renderItem={(item) => <Item>{item.content}</Item>}
/>

```