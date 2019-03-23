```js
initialState = {
  text: ''
}

handleChange = (val) => {
  setState({
    text: val
  })
}

<div style={{height: '40px'}}>
  <SearchBar
    label="search"
    value={state.text}
    onChange={handleChange}
  />
</div>
```