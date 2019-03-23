```js
const { Cell, Row } = require('./Table');


<Table renderHead={() => 
  <Row>
    <Cell><Checkbox /></Cell>
    <Cell>Ipsum</Cell>
    <Cell numeric>numeric</Cell>
    <Cell>amet</Cell>
  </Row>
}>
  <Row>
    <Cell><Checkbox /></Cell>
    <Cell>Ipsum</Cell>
    <Cell numeric>1</Cell>
    <Cell>amet</Cell>
  </Row>
  <Row>
    <Cell><Checkbox /></Cell>
    <Cell>Ipsum</Cell>
    <Cell numeric>2</Cell>
    <Cell>amet</Cell>
  </Row>
</Table>

```
