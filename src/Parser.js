import Token from './Token'

function isString(str) { return typeof str === 'string'; }
function isNumber(num) { return typeof num === 'number'; }
function isArray(arr) { return arr instanceof Array; }

/**
 * @class Parser
 */
export default class Parser {
  get token() { return this.tokens[this.token_index]; }
  get underMax() { return this.max > 0 && this.captured.length <= this.max || this.max === -1; }
  get overMin() {
    const curMatch = this.tokens.filter(t => !t.matched).length ? 0 : 1;
    return (this.captured.length + curMatch >= this.min);
  }
  get matched() { return this.overMin && this.underMax }

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

  /**
   * Flushes every token within the pattern and returns their result as an array
   * @return {Array} The results of each token within the pattern
   */
  flushTokens() {
    // filter any `''` values, values that had a `min` match of 0
    return this.tokens.map(t => t.flush()).filter(v => !!v);
  }

  /**
   * Flush the pattern in its entirety and reset its `token_position`
   * @return {Array} The full match of this pattern
   */
  flush() {
    let captured = [];

    if(this.matched) captured = this.captured.concat(...this.flushTokens());

    this.token_index = 0;
    this.captured = [];
    return captured;
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
      this.token_index = 0;
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
