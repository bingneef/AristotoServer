require('app-module-path').addPath(__dirname);
const app   = require('./app');
const repl  = require('repl');
// eslint-disable-next-line import/no-extraneous-dependencies
const babel = require('./node_modules/babel-core')

const preprocess = (input) => {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code, binder) => {
    const assign = binder ? `global.${binder} = ` : '';
    return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
  };

  // match & transform
  const match = input.match(awaitMatcher);
  if (match) {
    input = `${asyncWrapper(match[2], match[1])}` // eslint-disable-line no-param-reassign
  }
  return input;
}

const replInstance = repl.start({ prompt: '> ' });
const _eval = replInstance.eval // eslint-disable-line no-underscore-dangle

replInstance.eval = (cmd, context, filename, callback) => {
  const code = babel.transform(preprocess(cmd), {
    presets: ['es2015', 'stage-3'],
    plugins: [
      ['transform-runtime', {
        regenerator: true
      }]
    ]
  }).code;
  _eval(code, context, filename, callback);
};

replInstance.context.app = app;
