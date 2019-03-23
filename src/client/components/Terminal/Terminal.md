__It is not recommended to use this component by itself:__
This will usually be controlled by some wrapper component (e.g. `TerminalManager`) that will make working with the component easier and reliably update the `value` prop, e.g. by adding proper carriage returns + line breaks, as well as ensuring both these characters are removed on a single backspace event.

```js
  initialState = {
    text: 'start typing something!'
  }

  handleInit = () => {
    console.log('Terminal initialised!');
  }

  handleKeyDown = (val) => {
    setState({
      text: state.text + val
    })
  }

  handleBackspace = () => {
    setState({
      text: state.text.slice(0, -1)
    })
  }

  handleEnter = () => {
    setState({
      text: state.text + '\r\n'
    })
  }

  <Terminal
    active={true}
    value={state.text}
    onInit={handleInit}
    onKeyDown={handleKeyDown}
    onBackspace={handleBackspace}
    onEnter={handleEnter}
  />
```