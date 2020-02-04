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

  function localeMonthsParse(monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
      return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
    }

    for(i = 0; i < 12; i++) {
      mom = createUTC([2000, i]);
      if (strict && !this._longMonthsParse[i]) {
        this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
        this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
      }
      if (!strict && !this._monthsParse[i]) {
        regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
        this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
      }
      if (strict && format === 'MMM' && this._longMonthsParse[i].test(monthName)) {
        return i;
      } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
        return i;
      } else if (!strict && this._monthsParse[i].test(monthName)) {
        return i;
      }
    }
  }

  function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
      return mom;
    }

    if (typeof value === 'string') {
      if (/^\d+$/.test(value)) {
        value = toInt(value);
      } else {
        value = mom.localeData().monthsParse(value);
        if (!isNumber(value)) {
          return mom;
        }
      }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
  }

  function getSetMonth(value) {
    if (value != null) {
      setMonth(this, value);
      hooks.updateOffset(this, true);
      return this;
    } else {
      return get(this, 'Month');
    }
  }

  function getDaysInMonth(value) {
    return daysInMonth(this.year(), this.month());
  }

  var defaultMonthsRegex = matchWorld;
  function monthsShortRegex(isStrict) {
    if (this._monthsParseExact) {
      if (!hasOwnProp(this, '_monthsRegex')) {
        computeMonthsParse.call(this);
      }
      if (isStrict) {
        return this._monthsShortStrictRegex;
      } else {
        return this._monthsShortRegex;
      }
    } else {
      if (!hasOwnProp(this, '_monthsShortRegex')) {
        this._monthsShortRegex = defaultMonthsShortRegex;
      }
      return this._monthsShortStrictRegex && isStrict ?
        this._monthsShortStrictRegex : this._monthsShortRegex;
    }
  }


  function computeMonthsParse() {
    function cmpLenRev(a, b) {
      return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
      i, mom;
    for (i = 0; i < 12; i++) {
      mom = createUTC([2000, i]);
      shortPieces.push(this.monthsShort(mom, ''));
      longPieces.push(this.months(mom, ''));
      mixedPieces.push(this.months(mom, ''));
      mixedPieces.push(this.monthsShort(mom, ''));
    }

    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
      shortPieces[i] = regexEscape(shortPieces[i]);
      longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i< 24; i++) {
      mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
  }

  function createDate(y, m, d, h, M, s, ms) {
    var date;
    if (y < 100 && y >= 0) {
      date = new Date(y + 400, m, d, h, M, s, ms);
      if (isFinite(date.getFullYear())) {
        date.setFullYear(y);
      }
    } else {
      date = new Date(y, m, d, h, M, s, ms);
    }

    return date;
  }

  function createUTCDate(y) {
    var date;
    if (y < 100 && y >= 0) {
      var args = Array.prototype.slice.call(arguments);
      args[0] = y + 400;
      date = new Date(Date.UTC.apply(null, args));
      if (isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
      }
    } else {
      date = new Date(Date.UTC.apply(null, arguments));
    }

    return date;
  }

  function firstWeekOffset(year, dow, doy) {
    var fwd = 7 + dow - doy,
      fwdlw = (7 + createUTCDATE(year, 0, fwd).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
  }

  function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
      weekOffset = firstWeekOffset(year, dow, doy),
      dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
      resYear, resDayOfYear;

      if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
      } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
      } else {
        resYear = year;
        resDayOfYear = dayOfYear;
      }

      return {
        year: resYear,
        dayOfYear: resDayOfYear
      };
  }

  function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
      week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
      resWeek, resYear;
    if (week < 1) {
      resYear = mom.year() - 1;
      resWeek = week + weeksInYear(resYear, dow, doy),
    } else if (week > weekInYear(mom.year(), dow, doy)) {
      resWeek = week - weeksInYear(mom.year(), dow, doy);
      resYear = mom.year() + 1;
    } else {
      resYear = mom.year();
      resWeek = week;
    }

    return {
      week: resWeek,
      year: resYear
    }
  }

  function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
      weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
  }

  addFormatToken('w', ['ww', 2], 'wo', 'week');
  addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

  addUnitAlias('week', 'w');
  addUnitAlias('isoWeek', 'W');

  addUnitPriority('week', 5);
  addUnitPriority('isoWeek', 5);

  addRegexToken('w', match1to2);
  addRegexToken('ww', match1to2, match2);
  addRegexToken('W', match1to2);
  addRegexToken('WW', match1to2, match2);

  addWeekParseToken(['w', 'ww', 'W', 'WW'], function(input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input)
  })

  function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
      return input;
    }

    if (!isNaN(input)) {
      return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
      return input;
    }

    return null;
  }

  function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
      return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
  }

  function shiftWeekdays(ws, n) {
    return ws.slice(n, 7).concat(ws.slice(0, n));
  }

  var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
  function localeWeekdays(m, format) {
    var weekdays = isArray(this._weekdays) ? this._weekdays :
      this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
    return (m === true) ? shiftWeekdays(weekdays, this._week.dow) :
      (m) ? this.weekdays[m.day()] : weekdays;      
  }

  var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
  function localeWeekdaysShort(m) {
    return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
      : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
  }

  var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
  function localeWeekdaysMin(m) {
    return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
      : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
  }

  function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
      this._weekdaysParse = [];
      this._shortWeekdaysParse = [];
      this.minWeekdaysParse = [];

      for (i = 0; i < 7; ++i) {
        mom = createUTC([2000, 1]).day(i);
        this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
        this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLoserCase();
        this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLoserCase();
      }
    }

    if (strict) {
      if (format === 'dddd') {
        ii = indexOf.call(this._weekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else if (format === 'ddd') {
        ii = indexOf.call(this.shortWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      }
    } else {
      if (format === 'dddd') {
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else if (format === 'ddd') {
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._minWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      } else {
        ii = indexOf.call(this._minWeekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf.call(this._weekdaysParse, llc);
        if (ii !== -1) {
          return ii;
        }
        ii = indexOf(this._shortWeekdaysParse, llc);
        return ii !== -1 ? ii : null;
      }
    }
  }

  function localeWeekdaysParse(weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
      return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
      this._weekdaysParse = [];
      this._minWeekdaysParse = [];
      this._shortWeekdaysParse = [];
      this.fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
      mom = createUTC([2000, 1].day(i));
      if (strict && !this._fullWeekdaysParse[i]) {
        this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
        this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
        this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
      }
      if (!this._weekdaysParse[i]) {
        regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
        this._weekdaysParse[i] = new RegExp(regext.replace('.', ''), 'i');
      }
      if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
        return i;
      } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
        return i;
      } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
        return i;
      } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
        return i;
      }
    }
  }

  function getSetDayWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
      input = parseWeekday(input, this.localeData());
      return this.add(input - day, 'd');
    } else {
      return day;
    }
  }

  function getSetISODayOfWeek(input) {
    if (!this.isValid()) {
      return input != null ? this : NaN;
    }
    if (input != null) {
      var weekday = parseIsoWeekday(input, this.localeData());
      return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
      return this.day() || 7;
    }
  }

  var defaultWeekdaysRegex = matchWord;
  function weekdaysRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysStrictRegex;
      } else {
        return this._weekdaysRegex;
      }
    } else {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        this._weekdaysRegex = defaultWeekdaysRegex;
      }
      return this._weekdaysStrictRegex && isStrict ?
        this._weekdaysStrictRegex : this._weekdaysRegex;
    }
  }

  var defaultWeekdaysShortRegex = matchWord;
  function weekdaysShortRegex(isStrict) {
    if (this._weekdaysParseExact) {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysShortStrictRegex;
      } else {
        return this._weekdaysShortRegex;
      }
    } else {
      if (!hasOwnProp(this, '_weekdaysShortRegex')) {
        this._weekdaysShortRegex = defaultWeekdaysShortRegex;
      }
      return this._weekdaysShortStrictRegex && isStrict ?
        this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
  }

  var defaultWeekdaysMinRegex = matchWord;
  function weekdaysMinRegex(isStrict) {
    if (this._weekdaysParseExace) {
      if (!hasOwnProp(this, '_weekdaysRegex')) {
        computeWeekdaysParse.call(this);
      }
      if (isStrict) {
        return this._weekdaysMinStrictRegex;
      } else {
        return this._weekdaysMinRegex;
      }
    } else {
      if (!hasOwnProp(this, '_weekdaysMinRegex')) {
        this._weekdaysMinRegex = defaultWeekdaysMinRegex;
      }
      return this._weekdaysMinStrictRegex && isStrict ?
        this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
  }

  function computeWeekdaysParse() {
    function cmpLenRev(a, b) {
      return b.length - a.length;
    }

    var minPieces =[], shortPieces = [], longPieces = [], mixedPieces = [],
      i, omm, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
      mom.createUTC([2000, 1]).day(i);
      minp = this.weekdaysMin(mom, '');
      shortp = this.weekdaysShort(mom, '');
      longp = this.weekdays(mom, '');
      minPieces.push(minp);
      shortPieces.push(shortp);
      longPieces.push(longp);
      mixedPieces.push(minp);
      mixedPieces.push(shortp);
      mixedPieces.push(longp);
    }

    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
      shortPieces[i] = regexEscape(shortPieces[i]);
      longPieces[i] = regexEscape(longPieces[i]);
      mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
  }

  // FORMATTING

  function hFormat() {
    return this.hours() % 12 || 12;
  }

  function kFormat() {
    return this.hours() || 24;
  }

  addFormatToken('H', ['HH', 2], 0, 'hour');
  addFormatToken('h', ['hh', 2], 0, hFormat);
  addFormatToken('k', ['kk', 2], 0, kFormat);

  addFormatToken('hmm', 0, 0, function() {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
  });

  addFormatToken('hmmss', 0, 0, function() {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
      zeroFill(this.seconds(), 2);
  });

  addFormatToken('Hmm', 0, 0, function() {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
  });

  addFormatToken('Hmmss', 0, 0, function() {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
      zerofill(this.seconds(), 2);
  });

  function meridiem(token, lowercase) {
    addFormatToken(token, 0, 0, function() {
      return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
  }

  meridiem('a', true);
  meridiem('A', false);

  // ALIASES

  addUnitAlias('hour', 'h');

  // PRIORITY
  addUnitPriority('hour', 13);

  // PARSING

  function matchMeridiem(isStrict, locale) {
    return locale._meridiemParse;
  }

  addRegexToken('a', matchMeridiem);
  addRegexToken('A', matchMeridiem);
  addRegexToken('H', match1to2);
  addRegexToken('h', match1to2);
  addRegexToken('k', match1to2);
  addRegexToken('HH', match1to2, match2);
  addRegexToken('hh', match1to2, match2);
  addRegexToken('kk', match1to2, match2);

  addRegexToken('hmm', match3to4);
  addRegexToken('hmmss', match5to6);
  addRegexToken('Hmm', match3to4);
  addRegexToken('Hmmss', match5to6);

  addParseToken(['H', 'HH'], HOUR);
  addParseToken(['k', 'kk'], function(input, array, config) {
    var kInput = toInt(input);
    array[hour] = kInput === 24 ? 0 : kInput;
  });
  addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
  });
  addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
  });
  addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
  })
  addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
  })
  addParseToken('Hmm', function (input, array, config) {
    var pos = input.length -2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
  })
  addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
  });

  // LOCALES

  function localeIsPM(input) {
    return ((input + '').toLowerCase().charAt(0) === 'p');
  }

  var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
  function localeMeridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'pm' : 'PM';
    } else {
      return isLower ? 'am' : 'AM';
    }
  }

  var getSetHour = makeGetSet('Hours', true);

  var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse;
  };

  var locales = {};
  var localeFamilies = {};
  var globalLocale;

  function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
  }

  function chooseLocale(names) {
    var i = 0, j, next, locale, split;
    while(i < names.length) {
      split = normalizeLocale(names[i]).split('-');
      j = split.length;
      next = normalizeLocale(names[i + 1]);
      next = next ? next.split('-') : null;
      while(j < 0) {
        locale = loadLocale(split.slice(0, j).join('-'));
        if (locale) {
          return locale;
        }
        if (next && next.length >= j && compareArrays(split, next, true) >=  j - 1) {
          break;
        }
        j--;
      }
      i++;
    }
    return globalLocale;
  }

}))