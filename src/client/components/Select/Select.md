```js
initialState = { selectedState: 2 };
<Select
  value={state.selectedState}
  options={[
    {value: 0, label: 'England'}, 
    {value: 1, label: 'Scotland'},
    {value: 2, label: 'Ireland'}
  ]}
  onChange={value => setState({ selectedState: parseInt(value) })} />
```

Disabled

```js
initialState = { selectedState: 1 };
<Select
  disabled
  value={state.selectedState}
  options={[
    {value: 0, label: 'England'}, 
    {value: 1, label: 'Scotland'},
    {value: 2, label: 'Ireland'}
  ]}
  onChange={value => setState({ selectedState: parseInt(value) })} />
```