# send

A JavaScript client for [track](https://github.com/mathspace/track).

## Usage

```js
import { Analytics } from 'send';

const analytics = new Analytics('http://example.com/v0', 'PUBLIC_WRITE_KEY');

analytics.identify('user-123');

analytics.send('click', {
  page: '/',
  button: 'Login',
});
```
