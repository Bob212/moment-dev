(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.moment = factory()
})(this, (function () { 'use strict';

  var hookCallback;

  function hooks () {
    return hookCallback.apply(null, arguments);
  }

  function setHookCallback(callback) {
    hookCallback = callback;
  }

  function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) ===  '[object Array]';
  }

  function isObject(input) {
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
  }

  function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
      return (Object.getOwnPropertyNames(obj).length === 0)
    } else {
      for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
          return false;
        }
      }
      return true;
    }
  }

  function isUndefined(input) {
    return input === void 0;
  }

  function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
  }

  function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
  }

  function map(arr, fn) {
    let res = [];
    arr.forEach((el, i) => {
      res.push((fn(arr[i], i)))
    })
    return res;
  }

  function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function extend(a, b) {
  	for (let i in b) {
  		if (hasOwnProp(b, i)) {
  			a[i] = b[i]
  		}
  	}

  	if (hasOwnProp(b, 'valueOf')) {
  		a.valueOf = b.valueOf;
  	}

  	if (hasOwnProp(b, 'toString')) {
  		a.toString = b.toString;
  	}

  	return a;
  }

  function createUTC (input, format, locale, strict) {
  	return createLocalOrUtc(input, format, locale, strict, true).utc();
  }

  function defaultParsingFlags() {
  	return {
  		empty: false,
  		unusedTokens : [],
  		unusedInput: [],
  		overflow: -2,
  		charsLeftOver: 0,
  		nullInput: false,
  		invalidMonts: null,
  		invalidFormat: false,
  		userInvalidated: false,
  		iso: false,
  		parsedDateParts: [],
  		meridiem: null,
  		rfc2822: false,
  		weekdayMissmatch: false
  	};
  }

  function getParsingFlags(m) {
  	if (m._pf === null) {
  		m._pf = defaultParsingFlags()
  	}
  	return m._pf;
  }

  var some;
  if (Array.prototype.some) {
  	some = Array.prototype.some;
  } else {
  	some = function(fun) {
  		var t = Object(this);
  		var len = t.length >>> 0

  		for (var i=0; i< len; i++) {
  			if (i in t && fun.call(this, t[i], i, t)) {
  				return true;
  			}
  		}

  		return false;
  	}
  }

  function isValid(m) {
  	if (m._isValid === null) {
  		var flags = getParsingFlags(m);
  		var parsedParts = some.call(flags.parsedDataParts, function (i) {
  			return i != null;
  		});
  		var isNowValid = !isNaN(m._d.getTime()) &&
  			 flags.overflow < 0 &&
  			 !flags.empty &&
  			 !flags.invalidMonth &&
  			 !flags.invalidWeekday &&
  			 !flags.weekdayMissmatch &&
  			 !flags.nullInput &&
  			 !flags.invalidFormat &&
  			 !flags.userInvalidated &&
  			 (!flags.meridiem || (flags.meridiem && parsedParts));
  		if (m_strict) {
  			isNowValid = isNowValid &&
  				flag.charsLeftOver === 0 &&
  				flags.unusedTokens.length &&
  				flags.bigHour === undefined;
  		}

  		if (Object.isFrozen === null || !Object.isFrozen(m)) {
  			m._isValid = isNowValid;
  		} else {
  			return isNowValid;
  		}
  	}
  	return m._isValid;
  }

  function createInvalid (flags) {
  	var m = createUTC(NaN);
  	if (flags != null) {
  		extend(getParsingFlags(m), flags);
  	} else {
  		getParsingFlags(m).userInvalidated = true;
  	}

  	return m;
  }

  var momentProperties = hooks.momentProperties = [];

  function copyConfig(to, from) {
  	var i, prop, val;

  	if (!isUndefined(from._isAMomentObject)) {
  		to._isAMomentObject = from._isAMomentObject;
  	}
  	if (!isUndefined(from._i)) {
  		to._i = from._i;
  	}
  	if (!isUndefined(from._f)) {
  		to._f = from._f;
  	}
  	if (!isUndefined(from._l)) {
  		to._l = from._l;
  	}
  	if (!isUndefined(from._strict)) {
  		to._strict = from._strict;
  	}
  	if (!isUndefined(from._tzm)) {
  		to._tzm = from._tzm;
  	}
  	if (!isUndefined(from._isUTC)) {
  		to._isUTC = from._isUTC;
  	}
  	if (!isUndefined(from._offset)) {
  		to._offset = from._offset;
  	}
  	if (!isUndefined(from._pf)) {
  		to._pf = getParsingFlags(from);
  	}
  	if (!isUndefined(from._locale)) {
  		to._locale = from._locale;
  	}

  	if (momentProperties.length > 0) {
  		for (i=0; i < momentProperties.length; i++) {
  			prop = momentProperties[i];
  			val = from[prop];
  			if (!isUndefined(val)) {
  				to[prop] = val;
  			}
  		}
  	}

  	return to;
  }

  var updateInProgress = false;

  function Moment(config) {
  	copyConfig(this, config);
  	this._d = new Date(config._d !== null ? config._d.getTime() : NaN);

  	if (!this.isValid()) {
  		this._d = new Date(NaN);
  	}
  	// Prevent infinite loop in case updateOffset creates new moment
    // objects.	
  	if (updateInProgress === false) {
  		updateInProgress = true;
  		hooks.updateOffset(this);
  		updateInProgress = false;
  	}
  }

  function isMoment(obj) {
  	return obj instanceof Moment || (obj != null && obj._isAmomentObject != null);
  }

  function absFloor (number) {
  	if (number < 0) {
  		return Math.ceil(number) || 0;
  	} else {
  		return Math.floor(number);
  	}
  }

  function toInt(argumentForCoercion) {
  	var coercedNumber = +argumentForCoercion;
  	var value = 0;

  	if (coercedNumber !== 0 && isFinite(coercedNumber)) {
  		value  absFloor(coercedNumber);
  	}

  	return value;
  }

  // compare 2 arrays and return the number of differences
  function compareArrays(array1, array2, dontConvert) {
  	let len = Math.min(array1.length, array2.length),
  		lengthDiff = Math.abs(array1.length - array2.length),
  		diffs = 0,
  		i;
  	for (i=0 ; i< len; i++) {
  		if ((dontConvert && array1[i] !== array2) ||
  			(!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
  			diffs++;
  		}
  	}
  	return diffs + lengthDiff;
  }

  function warn(msg) {
  	if (hooks.suppressDeprecation === false &&
  			(typeof console !== 'undefined') && console.warn) {
  		console.warn(`Deprecation warning: ${msg}`);
  	}
  }

  function deprecate(msg, fn) {
  	var firstTime = true;

  	return extend(function() {
  		if (hooks.deprecationHandler !== null) {
  			hooks.deprecationHandler(null, msg);
  		}
  		if (firstTime) {
  			var args = [];
  			var arg;
  			for (var i = 0; i < arguments.length; i++) {
  				arg = '';
  				if (typeof arguments[i] === 'object') {
  					arg += '\n[' + i + '] ';
  					for (var key in arguments[0]) {
  						arg += key + ': ' + arguments[0][key] + ', ';
  					}
  					arg = arg.slice(0 , -2);
  				} else {
  					arg = arguments[i];
  				}
  				args.push(arg);
  			}
  			warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
  			firstTime = false;
  		}
  		return fn.apply(this, arguments);
  	}, fn);
  }

  var deprecations = {};

  function deprecateSimple(name, msg) {
  	if (hooks.deprecationHandler != null) {
  		hooks.deprecationHandler(name, msg);
  	}
  	if (!deprecations[name]) {
  		warn(msg);
  		deprecations[name] = true;
  	}
  }

  hooks.suppressDeprecationWarnings = false;
  hooks.deprecationHandler = null;

  function isFunction(input) {
  	return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
  }

  function set(config) {
  	var prop, i;
  	for (i in config) {
  		prop = config[i];
  		if (isFunction(prop)) {
  			this[i] = prop
  		} else {
  			this['_' + i] = prop;
  		}
  	}
  	this._config = config;
  	this._dayOfMonthOrdinalPerseLenient = new RegExp(
  		(this._dayOfMonthOrdinalPerse.sourse || this._ordinalParse.sourse) +
  			'|' + (/\d{1,2}/).sourse);
  }

  function mergeConfigs(parentConfig, childConfig) {
  	var res = extend({}, parentConfig), prop;
  	for (prop in childConfig) {
  		if (hasOwnProp(childConfig, prop)) {
  			if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
  				res[prop] = {};
  				extend(res[prop], parentConfig[prop]);
  				extend(res[prop], childConfig[prop])
  			} else if (childConfig[prop] != null) {
  				res[prop] = childConfig[prop];
  			} else {
  				delete res[prop]
  			}
  		}
  	}
  	for (prop in parentConfig) {
  		if (hasOwnProp(parentConfig, prop) &&
  			!hasOwnProp(childConfig, prop) &&
  			isObject(parentConfig[prop])) {
  			res[prop] = extend({}, res[prop]);
  		}
  	}
  	return res;
  }

  function Locale(config) {
  	if (config != null) {
  		this.set(config)
  	}
  }

  var keys;

  if (Object.keys) {
  	keys = Object.keys;
  } else {
  	keys = function(obj) {
  		var i, res = [];
  		for (i in obj) {
  			if (hasOwnProp(obj, i)) {
  				res.push(i);
  			}
  		}
  		return res;
  	}
  }

  var defaultCalendar = {
  sameDay: '[Today at] LT',
  nextDay: '[Tomottow at] LT',
  nextWeek: 'dddd [at] LT',
  lastDay: '[Yesterday at] LT',
  lastWeek: '[Last] dddd [at] LT',
  sameElse: 'L'
  };

  function calendar(key, mom, now) {
  var output = this._calendar[key] || this._calendar['sameElse'];
  return isFunction(output) ? output.call(mom, now) : output;
  }

  var defaultLongDateFormat = {
  LTS : 'h:mm:ss A',
  LT : 'h:mm A',
  L : 'MM/DD/YYYY',
  LL : 'MMMM D, YYYY',
  LLL : 'MMMM D, YYYY h:mm A',
  LLLL : 'dddd, MMMM D, YYYY h:mm A'
  }

  function longDateFormat(key) {
  var format = this._longDateFormat[key],
      formatUpper = this._longDateFormat[key.toUpperCase()];

  if (format || !formatUpper) {
    return format;
  }

  this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function(val) {
    return val.slice(1);
  })

  return this._longDateFormat[key];
  }

  var defaultInvalidDate = 'Invalid date';

  function ordinal (number) {
  return this._ordinal.replace('%d', number);
  }

  var defaultRelativeTimer = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years'
  };

  function relativeTime(number, withoutSuffix, string, isFuture) {
  var output = this._relativeTime[string];
  return (isFunction(output)) ?
    output(number, withoutSuffix, string, isFuture) :
    output.replace(/%d/i, number);
  }

  function pastFuture(diff, output) {
  var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
  return isFunction(format) ? format(output) : format.replace(/%s/i, output);
  }

  var aliases = {};

  function addUnitAlias(unit, shortHand) {
  var lowerCase = unit.toLowerCase();
  aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shortHand] = unit;
  }

  function normalizeUnits(units) {
  return typeof units === 'string' ? aliases[units] || aliases[units.toLoserCase()] : undefined;
  }

  function normalizeObjectUnits(inputObject) {
  var normalizedInput = {},
      normalizedProp,
      prop;

  for (prop in inputObject) {
    if (hasOwnProp(inputObject, prop)) {
      normalizedProp = normalizeUnits(prop);
      if (normalizedProp) {
        normalizedInput[normalizedProp] = inputObject[prop];
      }
    }
  }

  return normilizedInput;
  }

  var priorities = {};

  function addUnitPriority(unit, prioprity) {
  prioritues[unit] = priority;
  }

  function getPrioritizedUnits(unitsObj) {
  var units = [];
  for (var u in unitsObj) {
    units.push({unit: u, priority: priorities[u]});
  }
  units.sort(function(a, b) {
    return a.priority - b.priority;
  })

  return units;
  }

  function zeroFill(number, targetLength, firceSign) {
  var absNumber = '' + Math.abs(number),
      zerosToFill = targetLength - absNumber.length,
      sign = number >= 0;
  return (sign ? (forceSign ? '+' : '') : '-') +
      Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
  }

  var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

  var localFormattingTokens =  /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

  var formatFunctions = {};

  var formatTokenFunctions = {};

  // token:    'M'
  // padded:   ['MM', 2]
  // ordinal:  'Mo'
  // callback: function () { this.month() + 1 }
  function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
      func = function () {
        return this[callback]();
      }
    }
    if (token) {
      formatTokenFunctions[token] = func;
    }
    if (padded) {
      formatTokenFunctions[padded[0]] = function () {
        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
      };
    }
    if (ordinal) {
      formatTokenFunctions[ordinal] = function() {
        return this.localeData().ordinal(funct.apply(this, arguments))
      };
    }
  }

  function removeFormattingTokens(input) {
    if (input.match)(/\[[\s\S]/) {
      return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
  }

  function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;
    for (i = 0; length = array.length; i < length; i++)  {
      if (formatTokenFunctions[array[i]]) {
        array[i] = formatTokenFunctions[array[i]];
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }

    return function (mom) {
      var output = '', i;
      for (i = 0; i < length; i++) {
        output+= isFunction(array[i]) ? array[i].call(mom, format)
      }
      return output;
    }
  }

  function formatMoment(m, format) {
    if (!m.isValid()) {
      return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunctions(format);

    return formatFunctions[format](m);
  }

  function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
      return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while(i >=0 && localFormattingTokens.test(format)) {
      format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
      localFormattingTokens.lastIndex = 0;
      i -= 1;
    }

    return format
  }

  var match1 = /\d/;
  var match2 = /\d{2}/;
  var match3 = /\d{3}/;
  var match4 = /\d{4}/;
  var match6 = /[+-]?\d{6}/
  var match1to2 = /\d\d?/;
  var match3to4 = /\d\d\d\d?/;
  var match5to6 = /\d\d\d\d\d\d?/;
  var match1to3 = /\d{1,3}/;
  var match1to4 = /\d{1,4}/;
  var match1to6 = /\d{1,6}/;

  var matchUnsigned = /\d+/;

  var matchSigned = /[+-]?\d+/;

  var matchOffset = /Z|[+-]\d\d:?\d\d/gi
  var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi

  var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;

  var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

  var regexes = {};

  function addRegexToken (token, regex, strictRegex) {
  	regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
  		return (isStrict && strictRegex) ? strictRegex : regex;
  	};
  }

  function getParseRegexForToken (token, config) {
  	if (!hasOwnProp(regexes, token)) {
  		return new RegExp(unescapeFormat(token));
  	}

  	return regexes[token](config._strict, config._locale);
  }

  function unescapeFormat(s) {
  	return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
  		return p1 || h2 || p3 || p4;
  	}));
  }

  function regexEscape(s) {
  	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  var tokens = {};

  function addParseToken (token, callback) {
  	var i, func = callback;
  	if (typeof token === 'string') {
  		token = [token];
  	}
  	if (isNumber(callback)) {
  		func = function (input, array) {
  			array[callback] = toInt(input);
  		};
  	}
  	for (i = 0; i < token.length; i++) {
  		tokens[token[i]] = func;
  	}
  }

  function addWeekParseToken (token, callback) {
  	addParseToken(token, function(input, array, config, token) {
  		config._w = config._w || {};
  		callback(input, config._w, config, token);
  	});
  }

  function addTimeToArrayFromToken(token, input, config) {
  	if (input != null && hasOwnProp(tokens, token)) {
  		tokens[token](input, config._a, config, token);
  	}
  }

  var YEAR = 0;
  var MONTH = 1;
  var DATE = 2;
  var HOUR = 3;
  var MINUTE = 4;
  var SECOND = 5;
  var MILLISECOND = 6;
  var WEEK = 7;
  var WEEKDAY = 8;

  addFormatToken('Y', 0, 0, function () {
  	var y =  this.year();
  	return y <= 9999 ? '' + y : '+' + y;
  });

  addFormatToken(0, ['YY', 2], 0, function() {
  	return this.year() % 100;
  })

  addFormatToken(0, ['YYYY', 4], 0, 'year');
  addFormatToken(0, ['YYYYY', 5], 0, 'year');
  addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

  addUnitAlias('year', 'y');

  addUnitPriority('year', 1);

  addRegexToken('Y', matchSigned);
  addRegexToken('YY', match1to2, match2);
  addRegexToken('YYYY', match1to4, match4);
  addRegexToken('YYYYY', match1to6, match6);
  addRegexToken('YYYYYY', match1to6, match6);

  addParseToken(['YYYYY', 'YYYYYY'], YEAR);
  addParseToken('YYYY', function(input, array) {
  	array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
  })
  addParseToken('YY', function(input, array) {
  	array[YEAR] = hooks.parseTwoDigitYear(input);
  })

  // HELPERS

  function daysInYears(year) {
    return isLeapYear(year) ? 366 : 365;
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // HOOKS

  hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
  };

  // MOMENTS

  var getSetYear = makeGetSet('FullYear', true);

  function getIsLeapYear() {
    return isLeapYear(this.year());
  }

  function makeGetSet(unit, keepTime) {
    return function(value) {
      if (value != null) {
        set$1(this, unit, value);
        hooks.updateOffset(this, keepTime);
        return this;
      } else {
        return get(this, unit);
      }
    };
  }

  function get(mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
  }

  function set$1(mom, unit, value) {
    if (mom.isValid() && !isNaN(value)) {
      if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
      } else {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
      }
    }
  }

  // MOMENTS

  function stringGet(units) {
    units = normilizeUnits(units);
    if (isFunction(this[units])) {
      return this[units]();
    }
    return this;
  }

  function stringSet(units, value) {
    if (typeof units === 'object') {
      units = normalizeObjectUnits(units);
      var prioritized = getPrioritizedUnits(units);
      for (var i = 0; i < prioritized.length; i++) {
        this[prioritized[i].unit](units[prioritized[i].unit]);
      }
    } else {
      units = normilizeUnits(units);
      if (isFunction(this[units])) {
        return this[units](value);
      }
    }
    return this;
  }

  function mod(n, x) {
    return ((n % x) + x) % x;
  }

  var indexOf;

  if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function (o) {
      var i;
      for (i = 0; i < this.length; i++) {
        if (this[i] === o) {
          return i;
        }
      }
      return -1;
    }
  }

  function daysInMonth(year, month) {
    if (isNaN(year) || isNaN(month)) {
      return NaN;
    }
    var modMonth = mod(month, 12);
    year += (month - modMonth) / 12;
    return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
  }

  // FORMATTING

  addFormatToken('M', ['MM', 2], 'Mo', function() {
    return this.month() + 1;
  });

  addFormatToken('MMM', 0, 0, function(format) {
    return this.localeData().monthsShort(this, format);
  });

  addFormatToken('MMMM', 0, 0, function(format) {
    return this.localeData().months(this, format);
  })

  // ALIASES

  addUnitAlias('month', 'M');
  addUnitPriority('month', 8);

  // PARSING

  addRegexToken('M', match1to2);
  addRegexToken('MM', match1to2, match2);
  addRegexToken('MMM', function(isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
  });
  addRegexToken('MMMM', function(isStrict, locale) {
    return locale.monthsRegex(isStrict);
  });

  addParseToken(['M', 'MM'], function(input, array) {
    array[MONTH] = toInt(input) - 1;
  })

  addParseToken(['MMM', 'MMMM'], function(input, array, config, token) {
    var month = config._locale,monthsParse(input, token, config._strict);
    if (month != null) {
      array[MONTH] = month;
    } else {
      getParsingFlags(config).invalidMonth = input;
    }
  });

  // LOCALES

  var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
  var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
  function localeMonths(m, format) {
    if (!m) {
      return isArray(this._months) ? this._months :
          this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat] || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
  }

  var defaultMonthssShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
  function localeMonthsShort(m, format) {
    if (!m) {
      return isArray(this._monthsShort) ? this._monthsShort :
          this._monthsShort['standalone']; 
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
  }

  function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
      // this is not used
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
      for (i = 0; i < 12; ++i) {
        mom = createUTC([2000, i]);
        this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
        this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
      }
    }

    if (strict) {
      if (format === 'MMM') {
        ii = indexOf.call(this._shortMonthsParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._longMonthsParse, llc);
        return ii !== -1 ? ii : null;
      }
    } else {
      if (format === 'MMM') {
        ii = indexOf.call(this._shortMonthParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._longMonthsParsem llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._longMonthsParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortMonthsParse, llc);
        return ii !== -1 ? ii : null;
      }
    }
  }


}))