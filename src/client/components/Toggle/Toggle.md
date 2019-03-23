Uncontrolled

```js
<Toggle label="Left Text" alignText="left"/>
<br />
<Toggle label="Right Text" alignText="right"/>
```

Controlled

```js
<Toggle selected={true} label="You can't change me" />
```

Controlled w/ Updates

```js
initialState = {
  selected: true
}

handleChange = (selected) => {
  setState({
    selected
  })
}

<Toggle selected={state.selected} onChange={handleChange} label="I am controlled via external state" />

```