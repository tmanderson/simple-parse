/**
 * Parser Module
 * @module
 */
import Token from './Token'

function isString(str) { return typeof str === 'string'; }
function isNumber(num) { return typeof num === 'number'; }
function isArray(arr) { return arr instanceof Array; }

/**
 * Class Parser
 */
export default class Parser {
  /**
   * Get the current token
   * @return {Token} - the active token
   */
  get token() { return this.tokens[this.token_index]; }
  /**
   * Determines if the Parser is meeting its (potentially) defined `max` matches
   * @return {Boolean} - true if under `max` match limit, false otherwise
   */
  get underMax() { return this.max > 0 && this.captured.length <= this.max || this.max === -1; }
  /**
   * Determines if the Parser is meeting its defined `min` matches (defaults to 1)
   * @return {Boolean} - true if `min` matches are present, false otherwise
   */
  get overMin() {
    const curMatch = this.tokens.filter(t => !t.matched).length ? 0 : 1;
    return (this.captured.length + curMatch >= this.min);
  }
  /**
   * Determines if the parser is currently a valid match
   * @return {Boolean} - true if it's matching (or has a match), false otherwise
   */
  get matched() { return this.overMin && this.underMax }

  /**
   * Creates a Parser instance
   * ```JavaScript
   * // matches 1+ letters followed by ONE space only
   * const parser = new Parser('[a-z]', [' ', 1, 1, false])
   * parser.feed('hello world     hello everyone')
   * // returns: [['hello', 'world'], ['hello', 'everyone']]
   * ```
   *
   * @param  {...(Token|Array|String)} tokens - An argument list of tokens creating this parser's
   * matching signature
   */
  constructor(...tokens) {
    const [min=1, max=-1] = tokens.filter(t => typeof t === 'number');

    this.min = min
    this.max = max

    this.tokens = tokens.filter(t => !isNumber(t))
      .map(token => {
        if(token instanceof Token) {
          return token;
        }
        else if(typeof token === 'string') {
          return new Token(token);
        }
        else if(token instanceof Array) {
          if(token.filter(t => isString(t) || isArray(t)).length > 1) {
            return new Parser(...token);
          }
          else {
            return new Token(...token);
          }
        }
      });

    this.token_index = 0;
    this.captured = [];
  }

  reset() {
    this.flushTokens();
    this.token_index = 0;
  }

  /**
   * Flush the pattern in its entirety and reset its `token_position`
   * @return {Array.<string,Array.<string>>} The full match of this pattern
   */
  flush() {
    const captured = this.captured;

    if(this.matched) captured.push(...[].concat(...this.flushTokens()));

    this.token_index = 0;
    this.captured = [];
    return captured;
  }

  /**
   * Flushes every token within the pattern and returns their result as an array
   * @return {Array} The results of each token within the pattern
   */
  flushTokens(empty=true) {
    // filter any `''` values, values that had a `min` match of 0
    return this.tokens.map(t => t.flush(empty)).filter(v => !!v);
  }

  /**
   * Advances the `token_index` and flushes the pattern if reverting to the first
   * token position.
   * @return {Token} The active token, after advancing
   */
  next() {
    this.token_index++;

    if(this.token_index >= this.tokens.length) {
      // flush all captured data if the last was a match
      if(this.matched) this.captured.push(...this.flushTokens())
      this.reset();
    }

    return this.token;
  }

  /**
   * Checks to see if the given `char` is relevant to the pattern in whatever
   * state.
   * @param  {String} char - a character to match against the pattern
   * @return {Boolean}       the characters matching status
   */
  match(char) {
    if(!this.token.match(char)) {
      if(this.token.matched) {
        this.next();
        return this.match(char);
      }

      return false;
    }

    return true;
  }

  /**
   * Evaluate an entire string input against the pattern
   * @param  {String} string - the input to match against the pattern
   * @return {Array}           the matched content
   */
  feed(string) {
    for(let i = 0; i < string.length; i++) {
      while(this.token.match(string.charAt(i))) i++;
      if(this.token.matched) {
        i--;
        this.next();
      }
      else {
        this.flushTokens()
      }
    }

    return this.flush()
  }
}
