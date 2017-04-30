/* eslint-disable import/no-extraneous-dependencies */
require('app-module-path').addPath(__dirname);
const app     = require('./app');
const models  = require('./models');
const reload  = require('require-reload')(require)
const repl    = require('repl');
const babel   = require('babel-core')

const preprocess = (input) => {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code, binder) => {
    const assign = binder ? `global.${binder} = ` : '';
    return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
  };

  // match & transform
  const match = input.match(awaitMatcher);
  if (match) {
    // eslint-disable-next-line no-param-reassign
    input = `${asyncWrapper(match[2], match[1])}`
  }
  return input;
}

const replInstance = repl.start({ prompt: '> ' });
// eslint-disable-next-line no-underscore-dangle
const _eval = replInstance.eval

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
replInstance.context.models = models;
replInstance.context.reload = reload;
