String.prototype.capitilize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// X(?=Y)	lookahead	,(?<=Y)X lookbehind,
//  X(?!Y)	Negative lookahead, (?<!Y)X	Negative lookbehind
