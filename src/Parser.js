/**
 * @class Pattern
 */
class Pattern {
  get matched() { return this.captured.length > 0 || !this.tokens.filter(t => !t.matched).length }
  get token() { return this.tokens[this.token_index]; }

  constructor(...tokens) {
    this.tokens = tokens;
    this.token_index = 0;
    this.captured = [];
  }

  flushTokens() {
    return this.tokens.map(t => t.flush()).filter(v => !!v);
  }

  flush() {
    let captured = [];

    if(this.matched) captured = this.captured.concat(...this.flushTokens());

    this.token_index = 0;
    this.captured = [];
    return captured
  }

  next() {
    this.token_index++;

    if(this.token_index >= this.tokens.length) {
      // flush all captured data if the last was a match
      if(this.matched) this.captured.push(...this.flushTokens())
      this.token_index = 0;
    }

    return this.token;
  }

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

  feed(string) {
    for(let i = 0; i < string.length; i++) {
      while(this.token.match(string.charAt(i))) i++;
      if(this.token.matched) {
        i--;
        this.next();
      }
    }

    return this.flush()
  }
}
