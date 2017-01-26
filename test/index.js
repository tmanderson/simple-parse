var path = require('path');
var { Parser } = require(path.resolve(__dirname, '../dist/simple-parse'));

var words = new Parser([
  '[a-z]',
  [' ', 1, 1, false]
]);

console.log(words.feed('hello world  hello everyone'));

const whitespace = ['[ \n\r]', 0, false];
const identifier = ['[a-zA-Z0-9]'];
const arglist = [
  '\\(',
  [
    '[a-z]+',
    [',', 0, false], // match a comma 0 or more times, do not capture
    [' ', 0, false], // match a space 0 or more times, do not capture
    0
  ],
  '\\)', // match a closing parenthesis one or more times
];
const lbrack = '\\{'
const rbrack = '\\}'
const blockStart = [ lbrack, whitespace ]
const blockEnd = [ whitespace, rbrack ]
const func = [
  identifier,
  whitespace,
  arglist,
  whitespace,
  ...blockStart,
];

const parser =
new Parser([
  ...func,
  [
    ...func,
    0
  ],
  ...blockEnd
])

// const parser = new Parser(func);

const code = `
test1 (one,two){ };
test2(three, four) { };
test3(five, six) {
  test4(eight, nine) { };
};
`

console.dir(parser.feed(code), { depth: 6, colors: true })
// console.dir(parser.tokens[1], { depth: 6, colors: true })
