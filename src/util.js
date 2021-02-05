class Util {
  constructor (config) {
    this.charmap = config.charmap;
  }
  static create (config) {
    return new Util(config.charmap);
  }
  not (expression) {
    if (expression) {
      return false;
    } else {
      return true;
    }
  }
  encode (text) {
    var chars = this.charmap;
    var q = "";
    for (var i = 0; i < text.length; i++) {
      if (chars.includes(text.substring(i, i + 1))) {
        var p = chars.indexOf(text.substring(i, i + 1)) + 1 
        var u = p + "";
        if (u.length < 2) {
          u = "0" + u;
        }
        q = q + u;
      } else {
        q = q + "70";
      }
    }
    return q;
  }
  decode (text) {
    var chars = this.charmap;
    var q = "";
    for (var i = 0; i < text.length; i = i + 2) {
      var code = text.substring(i, i + 2);
      var number = parseInt(code) - 1;
      if (number < chars.length) {
        q = q + chars.substring(number, number + 1);
      } else {
        q = q + "❓";
      }
    }
    return q;
  }
  splitInto (text, charactersPerSegment) {
    var chars = charactersPerSegment;
    var out = [];
    for (var i = 0; i < text.length/chars; i++) {
      out.push(text.substring(i * 256, (i + 1) * 256));
    }
    return out;
  }
  sleep (ms) {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      },ms);
    })
  }
}
module.exports = {
  Util: Util,
}
