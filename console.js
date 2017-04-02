require('app-module-path').addPath(__dirname);

const repl = require('repl');
const babel = require('babel-core');

var preprocess = (input) => {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code, binder) => {
    let assign = binder ? `global.${binder} = ` : '';
    return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
  };

  // match & transform
  const match = input.match(awaitMatcher);
  if (match) {
    input = `${asyncWrapper(match[2], match[1])}`;
  }
  return input;
}

const replInstance = repl.start({ prompt: '> ' });
const _eval = replInstance.eval;

replInstance.eval = (cmd, context, filename, callback) => {
  const code = babel.transform(preprocess(cmd), {
    presets: ['es2015', 'stage-3'],
    plugins: [
      ['transform-runtime', {
        'regenerator': true
      }]
    ]
  }).code;
  _eval(code, context, filename, callback);
};

// Load my app
const app = require('./app');
replInstance.context.app = app;
