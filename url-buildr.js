/**
* @fileoverview This object assembles URLs and routes
* @author Hasnain-Haider
*/

const _ = require('underscore');
const defaultOptions = require('./defaults.json');

/**
* @typedef {...string|object|string[]} iterable
* @param {object|string} initializer
* @param {string} initializer.prefix - Goes at the very begining of the URL, before host
* @param {string} initializer.host - hostname of the network
* @param {string|number} initializer.port - port of the network
* @param {string} initializer.pathPrefix - is the very first part of the path. Appears after the host and port
* @param {string[]} initializer.additions - segments to add on to the path to add after the prefix
* @param {object|string[]} initializer.params - parameters that are present in the url and the values
* @param {object|string[]} initializer.queries - url queries that appended at the end
*/

/**
* URLBuildr
* @namespace
* @class
*/
class URLBuildr {
/**
* Creates an object to create urls
* @constructor
* @param {string|object} initializer - if a string is passed, the urlString is set to it
  - if an object is passed, the url is immediately built based on the initializer's values
*/
  constructor(initializer) {
    this._init(initializer);
  }

  _init(initializer) {
    this.urlString = '';
    this.isBuilt = false;
    this.hasQuery = false;

    this.queries = {};
    this.params = {};
    this.additions = [];
    this.options = defaultOptions;
    let initype = typeof initializer;
    if (initype === 'string') {
      this.urlString = URLBuildr._sanitizeString(initializer);
      this.options.host = this.urlString;
      initializer = {};
    } else {
      this._initOptions(initializer);
    }
  }

  /** @function URLBuildr~_initOptions - assemble the url using the objects properties */
  _initOptions(_options) {
    this.options = _.assign({}, defaultOptions, _options);
    this.options.pathPrefix = URLBuildr._sanitizeString(this.options.pathPrefix);
    this._initArrays();
  }

  /** @function URLBuildr~_initArrays*/
  _initArrays() {
    var options = this.options;
    this.additions = options.additions;
    _.assign(this.queries, URLBuildr._accumulate(options.queries))
    _.assign(this.params, URLBuildr._accumulate(options.params));
    return this;
  }

/**
* @function URLBuildr~_buildBaseUrl */
  _buildBaseUrl() {
    var options = this.options;
    if(options.host) {
      this.urlString = `${options.prefix}${options.host}`;
      this.urlString += options.port ? `:${options.port}` : '';
      if (options.pathPrefix) {
        this.urlString += `/${options.pathPrefix}`;
      }
    }
    return this;
  }

  /**
  * @function URLBuildr~_sanitizeString - remove the first and last characters if they are '/'
  * @memberof URLBuildr
  */
  static _sanitizeString(str) {
    if (!str) return str;
    if(_.last(str) === '/') {
      str = str.substring(0, str.length - 1);
    }
    if(_.first(str) === '/') {
      str = str.substring(1);
    }
    return str;
  }

  /**
  * @function URLBuildr._accumulate - create an object from an iterable
  * @param {iterable} iterable - can be an object, array or variadric argument
  * @return {array[]}
  */

  static _accumulate(...iterable) {
    var result = {};
    var firstArg = _.first(iterable);
    if (Array.isArray(firstArg)) {
      iterable = _.flatten(iterable);
      firstArg = _.first(iterable);
    }

    let argType = typeof firstArg;
    if (argType === 'string' || Array.isArray(firstArg)) {
      for (let i = 0; i + 1 < iterable.length; i = i + 2) {
        result[iterable[i]] = iterable[i + 1];
      }
    } else if (argType === 'object') {
      _.assign(result, _.first(iterable));
    }
    return result;
  }

 /** @function URLBuildr~_build - finally assemble the URLs fragments */
  _build() {
    if (!this.isBuilt) {
      this
      ._buildBaseUrl()
      ._buildAdditions()
      ._buildParams()
      ._buildQueries();
      this.isBuilt = true;
    }
    return this;
  }

  _unbuild() {
    this.isBuilt = false;
    this.hasQuery = false;
  }

 /** @function URLBuildr~_buildAdditions - add path segments to urlString */
  _buildAdditions() {
    _.each(this.additions, (addition) => {
      this.urlString += `/${addition}`;
    });
    return this;
  }

  /** @function URLBuildr~_buildparams - fills in parameters in urlString  */
  _buildParams() {
    var keys = _.keys(this.params);
    _.each(keys, (key) => {
      const regex = new RegExp(':' + key + '(?!=w+)');
      this.urlString = this.urlString.replace(regex, this.params[key]);
    });
    return this;
  }

  /**
  * @function URLBuildr~_buildparams - generates a queryString at the end of urlString
  * @returns this
  */
  _buildQueries() {
    var keys = _.keys(this.queries);
    _.each(keys, (key) => {
      var queryString = key + '=' + this.queries[key];
      if (!this.hasQuery) {
        this.urlString += '?';
        this.hasQuery = true;
      } else {
        this.urlString += '&';
      }
      this.urlString += queryString;
    });
    return this;
  }

  /**
  * @function URLBuildr#set - reassign a property of options
  * @param {string} opt - the field of option to reassign
  * @param {string} val -  The value to give to the field
  * @returns this
  */
  set(opts) {
    _.each(_.keys(opts), (option) => {
      this.options[option] = opts[option];
    });
    this._unbuild();
    return this;
   }

  /**
  * @function URLBuildr#setOptions - overwrite the entire options object
  * @param {object} options
  * @returns this
  */

  /**
  * @function URLBuildr#add - fills in parameters
  * @param {...string|string|string[]} params
  */
  add(...str) {
    _.each(str, (string) => {
      this.additions = this.additions.concat(URLBuildr._sanitizeString(string));
    });
    this._unbuild();
    return this;
  }

  /**
  * @function URLBuildr#param - fills in parameters
  * @param {iterable} params
  */
  param(...params) {
    _.assign(this.params, URLBuildr._accumulate(...params));
    this._unbuild();
    return this;
  }

  /**
  * @function URLBuildr#query - fills in parameters
  * @param {iterable} params
  */
  query(...queries) {
    _.assign(this.queries, URLBuildr._accumulate(...queries));
    this.isBuilt = false;
    this._unbuild();
    return this;
  }

  /** @function URLBuildr#clear - reset the Objects options */
  clear() {
    this._unbuild();
    _.each(defaultOptions, opt => {
      this.options[opt] = defaultOptions[opt];
    })
  }

  create(initializer) {
    this._init(initializer);
    return this;
  }

  /**
  * @function URLBuildr#toString
  * @returns {string} urlString
  */
  toString() {
    return this._build().urlString;
  }
}

module.exports = new URLBuildr();
