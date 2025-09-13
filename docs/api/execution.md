# Execution Context API

The execution context provides access to node inputs, outputs, and data during execution.

## Context Methods

### getInput(socketName)
Get input value from a socket.

```javascript
function myNodeFunction(context) {
  const value = context.getInput('inputSocket');
  // Process value...
}
```

### setOutput(socketName, value)
Set output value for a socket.

```javascript
function myNodeFunction(context) {
  const result = processData(context.getInput('input'));
  context.setOutput('output', result);
}
```

### getData(key)
Get data from node's internal state.

```javascript
function myNodeFunction(context) {
  const config = context.getData('config');
  // Use config...
}
```

### setData(key, value)
Set data in node's internal state.

```javascript
function myNodeFunction(context) {
  context.setData('lastResult', result);
}
```

## Data Binding

Form controls with `data-key` attributes are automatically bound:

```html
<input type="number" data-key="value:number" value="0">
<select data-key="mode:selection">
  <option value="add">Add</option>
  <option value="multiply">Multiply</option>
</select>
```

Access bound data:
```javascript
function myNodeFunction(context) {
  const number = context.getData('value');
  const mode = context.getData('mode');
}
```

## Async Execution

Node functions can be async:

```javascript
async function fetchData(context) {
  const url = context.getInput('url');
  const response = await fetch(url);
  const data = await response.json();
  context.setOutput('data', data);
}
```