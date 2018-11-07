var rollup = require('rollup');
var babel = require('rollup-plugin-babel');

rollup
  .rollup({
    input: 'src/index.js',
    plugins: [babel()],
  })
  .then(function(bundle) {
    bundle.write({
      file: 'umd/index.js',
      format: 'umd',
      name: 'send',
    });
  });
