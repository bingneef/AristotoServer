module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  'rules': {
    'semi': 0,
    'no-multi-spaces': 0,
    'comma-dangle': 0
  //   // allow paren-less arrow functions
  //   'arrow-parens': 0,
  //   // allow async-await
  //   'generator-star-spacing': 0,
  //   // allow debugger during development
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
