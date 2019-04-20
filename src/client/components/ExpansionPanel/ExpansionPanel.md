Render-prop controlled expanding panel (implements `<AnimateHeight />` under the hood)

```js
// display: inline-block used to account for h5 margins)

<ExpansionPanel
  renderTitle={({ onClick, active }) => (
    <div onClick={onClick}>
      <h4>Header: {active ? 'active' : 'disabled'}</h4>
    </div>
  )}
>
  {({ active }) => (
    <div style={{display: 'inline-block'}}>
      <h5>Body</h5>
    </div>
  )}
</ExpansionPanel>
```

Controlled

```js
// display: inline-block used to account for h5 margins)

initialState = {
  active: true
}

togglePanel = () => {
  setState({
    active: !state.active
  })
}

<div>
  <button onClick={togglePanel}>toggle()</button>

  <ExpansionPanel
    active={state.active}
    renderTitle={({ onClick, active }) => (
      <div onClick={onClick}>
        <h4>Header: {active ? 'active' : 'disabled'}</h4>
      </div>
    )}
  >
    {({ active }) => (
      <div style={{display: 'inline-block'}}>
        <h5>Body</h5>
      </div>
    )}
  </ExpansionPanel>
</div>
```