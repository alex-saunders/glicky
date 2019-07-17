```js
const styled = require('styled-components').default;

initialState = {
  active: false
}

handleClick = () => {
  setState({
    active: !state.active
  })
}

const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 128px;
  border-radius: 3px;
`;
console.log(ModalCarousel.Slide);

<div> 
  <button onClick={handleClick}>Active ModalCarousel</button>
  {state.active ? (
    <ModalCarousel>
      <ModalCarousel.Slide>
        <Slide>Slide 1</Slide>
      </ModalCarousel.Slide>
      <ModalCarousel.Slide>
        <Slide>Slide 2</Slide>
      </ModalCarousel.Slide>
    </ModalCarousel> 
  ) : null }
</div>
```