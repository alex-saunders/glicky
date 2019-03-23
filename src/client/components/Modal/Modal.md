```js

initialState = {
  active: false
}

handleClick = () => {
  setState({
    active: true
  });
}

handleRequestClose = () => {
  setState({
    active: false
  });
}

<div>
  <button onClick={handleClick}>open</button>

  <Modal
    isActive={state.active}
    onRequestClose={this.handleRequestClose}
    title="Test modal"
    renderBody={() => (
      <div>
        Enim incididunt exercitation aliqua do irure veniam officia dolor sint
        occaecat anim. Ex fugiat exercitation nostrud ut tempor nulla laboris
        quis. Adipisicing officia aliquip mollit esse. Lorem elit mollit
        officia Lorem anim velit ad nulla laborum in occaecat ut.
      </div>
    )}
    renderFooter={() => (
      <div>footer</div>
    )}
  />
</div>
```