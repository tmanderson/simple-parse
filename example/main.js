const parser = new Pattern(
  new Token('[a-z]'),
  new Pattern(
    new Token('\\('),
    new Pattern(new Token('[a-z]'), new Token(',', 0, false), new Token(' ', 0, false)),
    new Token('\\)')
  )
);

const parseTree = parser.feed('test(one, two)');
console.dir(parseTree, { colors: true, depth: 4 })
