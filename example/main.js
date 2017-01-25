const Parser = SimpleParse.Parser;
// Defines a parser for simple JavaScript-like function
// signatures (eg `function(arg, argument) no body)
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

const parseTree = parser.feed('test(one, two); another(three, four, five)');
console.log(JSON.stringify(parseTree))
