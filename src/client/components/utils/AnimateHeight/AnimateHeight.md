AnimateHeight is a utility/wrapper component that animates its height upon content changes. `value` is used to check whether the contents have been updated and if `hasValueChanged(value, prevValue) === true`, the component will animate between the height it was prior to `value` being updated and after.

```js

initialState = {
  active: false,
  height: 'auto'
}

handleClick = () => {
  setState({
    active: !state.active
  })
}

handleHeightChange = (height) => {
  setState({
    height
  })
}

<div>
<button onClick={handleClick}>click me to change height of component</button>

<p>Height: {state.height}</p>

<AnimateHeight
  value={state.active}
  hasValueChanged={(value, prevValue) => value !== prevValue}
  onHeightChange={handleHeightChange}
>
<div>
  {
    !state.active ? (
      <div>
        <p>
          Commodo aute esse laborum officia est tempor tempor ex. Ut laboris non eiusmod aliqua ut cupidatat ullamco ad. Eiusmod in non est magna laborum. Dolor fugiat qui velit amet dolor pariatur voluptate deserunt sint Lorem ullamco officia.
        </p>
        <p>
          Cillum minim do dolor deserunt tempor sint laboris laborum eiusmod nostrud. Velit magna tempor est labore ad reprehenderit consequat adipisicing labore dolor. Ad adipisicing incididunt commodo duis amet officia occaecat occaecat. Deserunt consectetur laboris officia deserunt elit labore. Ullamco enim est nisi officia.
        </p>
    </div>
    ) : null
  }
  </div>
</AnimateHeight>
</div>
```