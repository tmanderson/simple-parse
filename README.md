# Simple-Parse
A simple psuedo-[parser combinator](https://www.wikiwand.com/en/Parser_combinator) implementation.

### Documentation
```
$> npm run docs
```

### Example
```javascript
const Parser = SimpleParse.Parser;
// Defines a parser for simple JavaScript-like function signatures
// (ie `function(arg, argument)`, no function body)

const parser = new Parser(
  '[a-z0-9]',
  [
    '\\(',
    [
      '[a-z0-9]',
      [',', 0, false], // match a comma 0 or more times, do not capture
      [' ', 0, false], // match a space 0 or more times, do not capture
      1,
      2 // limit to 2 matches of this set (the arguments)
    ],
    '\\)' // match a closing parenthesis one or more times
  ]
);

parser.feed('test(one, two); another(three, four, five)') => ["test", ["(", ["one", "two"], ")"]]

```
