/**
 * Token Module
 * @module Token
 */

/**
 * Class Token
 */
export default class Token {
  get underMax() { return this.max > 0 && this.captured.length <= this.max || this.max === -1; }
  get overMin() { return this.captured.length >= this.min }
  get matched() { return this.overMin && this.underMax; }
  get optional() { return this.min === 0; }

  /**
   * Creates a token instance
   * @param  {String}  match   The matching range/character for this token
   * @param  {Number}  min     Min matches necessary to fulfill
   * @param  {Number}  max     Max matches necessary to filfill
   * @param  {Boolean} capture Should return captured values when `flush`d
   */
  constructor(match, min=1, max=-1, capture=true) {
    if(typeof min === "boolean") capture = min;
    if(typeof max === "boolean") capture = max;

    this.min = typeof min === "boolean" ? 1 : min;
    this.max = typeof max === "boolean" ? -1 : max;
    this.captured = '';
    this.capture = capture;
    this.re = new RegExp(`^${match}$`);
  }
  /**
   * Flushes the captured content (if `capture` is true) and resets this `Token`
   * @return {String} - The captured content
   */
  flush(empty=true) {
    const captured = this.capture ? this.captured : '';
    if(empty) this.captured = '';
    return captured;
  }
  /**
   * Determine if this `Token` matches the given `char` in the context of
   * its currently captured content.
   * @param  {String} char - the character to matche the token against
   * @return {Boolean}     - True if the match is valid, false otherwise
   */
  match(char) {
    const matched = this.re.test(char);
    const captured = this.captured + char;
    if(matched && this.max < 0 || captured.length <= this.max) {
      this.captured += char;
    }
    return matched;
  }
}
