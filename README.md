# Simple-Parse
A simple psuedo-[parser combinator](https://www.wikiwand.com/en/Parser_combinator) implementation.

### Example
```javascript
let word, whitespace, words, sentence;

word = new Token('[a-z]'); // matches letters a-z
whitespace = new Token(' ', false) // do not capture the match
words = new Pattern(word, whitespace) // matches word, followed by a space

sentence = new Pattern(words, Token('.')) // words followed by a `.`

sentence.feed('this is a sentence.') => ['this', 'is', 'a', 'sentence']
```
