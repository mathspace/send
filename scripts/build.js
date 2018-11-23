var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

rollup
  .rollup({
    input: 'src/index.js',
    plugins: [babel(), resolve(), commonjs()],
  })
  .then(function(bundle) {
    bundle.write({
      file: 'dist/index.js',
      format: 'umd',
      name: 'send',
    });
  });
