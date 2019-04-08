Singe line controlled

```js

initialState = {
  value: ''
}

handleChange = (value) => {
  setState({
    value
  })
}

<TextField label="Test" value={state.value} onChange={handleChange}/>
```

Single line disabled

```js

initialState = {
  disabled: true
}

handleClick = () => {
  setState({
    disabled: !state.disabled
  })
}

<div>
  <button onClick={this.handleClick}>Toggle disabled</button>
  <br />
  <br />
  <TextField label="I am disabled" disabled={state.disabled}/>
</div>
```

Single line with icon

```js
const styled = require('styled-components').default;
const Icon = require('../Icon/Icon').default;

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;  
`;

<TextField label="I have an icon"  icon='edit' />
```

Multiline controlled

```js

initialState = {
  value: ''
}

handleChange = (value) => {
  setState({
    value
  })
}

<TextField label="Test" value={state.value} onChange={handleChange} multiline/>
```

Multiline uncontrolled

```js
<TextField label="10 Rows" multiline rows={10}/>
```

Error State
```js

initialstate = {
  error: false,
  value: ''
}

handleChange = (value) => {
  setState({
    value,
    error: value.length > 0
  })
}

<TextField
  label="Don't enter anything here"
  value={state.value}
  onChange={handleChange}
  error={state.error}
  fullWidth
  errorText={'I told you not to'}
/>

```

Error State triggered by button
```js
const Button = require('../Button/Button').default;

initialState = {
  error: false,
  value: ''
}

handleChange = (value) => {
  setState({
    value,
    error: value.length > 0 ? false : state.error
  })
}

submit = () => {
  setState({
    error: state.value.length < 1
  });
}

<div>
  <TextField
    label="Required"
    value={state.value}
    onChange={handleChange}
    error={state.error}
    errorText={'This is a required field'}
  />

  <br />
  <br /> 
  <Button onClick={submit}>Submit</Button>
</div>

```