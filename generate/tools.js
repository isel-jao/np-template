String.prototype.capitilize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.revCapitilize = function () {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

// X(?=Y)	lookahead	,(?<=Y)X lookbehind,
//  X(?!Y)	Negative lookahead, (?<!Y)X	Negative lookbehind
