var { Parser } = require('../dist/simple-parse');

var p = new Parser('[a-z]', [' ', 1, false])
console.log(p.feed('hello world     hello everyone'));

const parser = new Parser(
  '[a-z]+',
  [
    '\\(',
    [
      '[a-z]+',
      [',', 0, false], // match a comma 0 or more times, do not capture
      [' ', 0, false], // match a space 0 or more times, do not capture
      1,
      2 // limit to 2 matches of this set
    ],
    '\\)' // match a closing parenthesis one or more times
  ]
);

console.dir(parser.feed('test(one, two); another(three, four)'), { depth: 6, colors: true })
