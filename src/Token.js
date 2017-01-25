/**
 * @class Token
 */
export default class Token {
  get underMax() { return this.max > 0 && this.captured.length <= this.max || this.max === -1; }
  get overMin() { return this.captured.length >= this.min }
  get matched() { return this.overMin && this.underMax; }

  constructor(match, min=1, max=-1, capture=true) {
    if(typeof min === "boolean") capture = min;
    if(typeof max === "boolean") capture = max;

    this.min = typeof min === "boolean" ? 1 : min;
    this.max = typeof max === "boolean" ? -1 : max;
    this.captured = '';
    this.capture = capture;
    this.re = new RegExp(`^${match}$`);
  }

  flush() {
    const captured = this.capture ? this.captured : '';
    this.captured = '';
    return captured;
  }

  match(char) {
    const matched = this.re.test(char);
    if(matched) this.captured += char;
    return matched;
  }
}
