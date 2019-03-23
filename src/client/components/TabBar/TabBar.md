```js
const styled = require('styled-components').default;
const Tab = require('./TabBar').Tab;

const Container = styled.div`
  ${p => p.theme.elevation('e2')};
  background: ${p => p.theme.colour('primary')};
`;
const TabBody = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  color: #fff;
  cursor: pointer;
`;  

initialState = {
  activeTab: 1
};

setActiveTab = (index) => {
  setState({
    activeTab: index
  })
}

<Container>
<TabBar>
  <Tab active={state.activeTab === 1} onClick={() => setActiveTab(1)}><TabBody>1</TabBody></Tab>
  <Tab active={state.activeTab === 2} onClick={() => setActiveTab(2)}><TabBody>2</TabBody></Tab>
</TabBar>
</Container>
```