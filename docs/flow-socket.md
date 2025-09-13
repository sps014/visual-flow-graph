# flow-socket

Define input/output connection points for nodes.

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | String | - | **Required.** `"input"` or `"output"` |
| `name` | String | - | **Required.** Socket identifier |
| `label` | String | `name` | Display label |
| `data-type` | String | `"any"` | Data type for validation |
| `color` | String | - | Socket color |
| `size` | String | `"medium"` | Socket size (`"small"`, `"medium"`, `"large"`) |
| `custom-class` | String | - | Custom CSS class |
| `max-connections` | Number | - | Maximum connections allowed |

## Usage

```html
<!-- Input socket -->
<flow-socket type="input" name="value" label="Value" data-type="number"></flow-socket>

<!-- Output socket -->
<flow-socket type="output" name="result" label="Result" data-type="number"></flow-socket>
```

## Socket Shapes

| Shape | Description |
|-------|-------------|
| `circle` | Default circular socket |
| `square` | Square socket |
| `diamond` | Diamond-shaped socket |
| `triangle` | Triangular socket |

## Data Types

Common data types: `number`, `string`, `boolean`, `object`, `array`, `any`