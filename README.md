# input-bound
Web Component for a range input with a lower and upper slider

## Installation

    npm i input-bound


## Usage

In standard HTML:

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>InputRange</title>
  <script type="module" src="node_modules/input-bound/index.js"></script>
</head>
<body>
  <input-bound min="-10" max="5" lower="-3" upper="3" step="1"></input-bound>
</body>
</html>
```

In Vue:

```
<template>
  <input-bound :min="min" :max="max" :lower="lower" :upper="upper" step="1"></input-bound>
</template>
<script>
import 'input-bound';
export default {
  name: 'YourSlider'
  data: {
    min: 0,
    max: 100,
    lower: 0,
    upper: 100,
  },
}
</script>
```

## Contributing
  1. Fork it!
  2. Create your feature branch: `git checkout -b my-new-feature`
  3. Commit your changes: `git commit -am 'Add some feature'`
  4. Push to the branch: `git push origin my-new-feature`
  5. Submit a pull request :D

## License

SEE [LICENCE](LICENCE)