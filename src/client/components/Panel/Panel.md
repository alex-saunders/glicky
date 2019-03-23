```js
const styled = require('styled-components').default;

const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin: 8px 0;
  }
`
const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

<Column>
  <Panel elevation="e4">
    <Body>
      Panel
    </Body>
  </Panel>
  <Panel elevation="e2">
    <Body>
      Panel
    </Body>
  </Panel>
  <Panel elevation="e0">
    <Body>
      Panel
    </Body>
  </Panel>
</Column>
```