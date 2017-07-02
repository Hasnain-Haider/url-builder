/**
* @fileoverview This object assembles URLs and routes
* @author Hasnain-Haider
*/

const _ = require('underscore');
const defaultOptions = require('./defaults.json');

/**
*
* @param {object|string} initializer
* @param {string} initializer.prefix - Goes at the very begining of the URL, before host
* @param {string} initializer.host - hostname of the network
* @param {string|number} initializer.port - port of the network
* @param {string} initializer.pathPrefix - is the very first part of the path. Appears after the host and port

* @param {string[]} initializer.additions - segments to add on to the path to add after the prefix
* @param {object|string[]} initializer.params - parameters that are present in the url and the values
* @param {object|string[]} initializer.queries - url queries that appended at the end
*/

class URLBuilder {
/**
* Creates an object to create urls
* @constructor
* @param {string} initializer - if a string is passed, the urlString is set to it
* @param {object} initializer - if an object is passed, the url is immediately built based on the initializer's values
*/
  constructor(initializer) {
    this.urlString = '';
    this.isBuilt = false;
    this.hasQuery = false;

    this.queries = [];
    this.params = [];
    this.additions = [];
    this.options = defaultOptions;

    let initype = typeof initializer;
    if (initype === 'string') {
      this.urlString = URLBuilder._sanitizeString(initializer);
      this.options.host = this.urlString;
      initializer = {};
    } else {
      this._initOptions(initializer);
    }
  }
/**  @function _initOptions - assemble the url using the objects properties */
  _initOptions(_options) {
    var prePath = this.options.pathPrefix || {}
    this.options = _.defaults(_options, defaultOptions);
    this.options.pathPrefix = URLBuilder._sanitizeString(this.options.pathPrefix);
    this._initArrays();
  }

  _initArrays() {
    var options = this.options;
    this.additions = options.additions;
    this.queries   = URLBuilder._accumulate(options.queries);
    this.params    = URLBuilder._accumulate(options.params);
    return this;
  }

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

/** @function _sanitizeString - remove the first and last characters if they are '/' */
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
*
* @function _accumulate - create an array of subarrays (of length 2) from an object
* @param {...string|object|string[]} iterable - can be an object, array or variadric argument
* @return {array[]}
*/
  static _accumulate(...iterable) {
    var result = [];
    var firstArg = _.first(iterable);
    if (Array.isArray(firstArg)) {
      iterable = _.flatten(iterable);
      firstArg = _.first(iterable);
    }

    let argType = typeof firstArg;
    if (argType === 'string' || Array.isArray(firstArg)) {
      for (let i = 0; i + 1 < iterable.length; i = i + 2) {
        result.push([iterable[i], iterable[i + 1]]);
      }
    } else if (argType === 'object') {
      _.each(_.keys(firstArg), (key) => {
        result.push([key, firstArg[key]]);
      });
    }
    return result;
  }


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

/** @function _buildAdditions - add path segments to urlString */
  _buildAdditions() {
    _.each(this.additions, (addition) => {
      this.urlString += `/${addition}`;
    });
    return this;
  }

  /** @function _buildparams - fills in paraeters in urlString */
  _buildParams() {
    _.each(this.params, (pair) => {
      const regex = new RegExp(':' + _.first(pair) + '(?=[/\0])')
      this.urlString = this.urlString.replace(regex, _.last(pair));
    });
    return this;
  }

  /** @function _buildparams - generates a queryString at the end f urlString */
  _buildQueries() {
    _.each(this.queries, (query) => {
      var queryString = _.first(query) + '=' + _.last(query);
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

  setUrl(str) {
    this.urlString = str;
    return this;
  }

  set(opt, val) {
    this.options[opt] = val;
    this.isBuilt = false;
    return this;
   }

  setOptions(options) {
    this.options = options;
    this.isBuilt = false;
    return this;
  }

  add(...str) {
    _.each(str, (string) => {
      this.additions = this.additions.concat(URLBuilder._sanitizeString(string));
    });
    return this;
  }

  param(...params) {
    this.params = this.params.concat(URLBuilder._accumulate(...params));
    return this;
  }

  query(...queries) {
    this.queries = this.queries.concat(URLBuilder._accumulate(...queries));
    return this;
  }

  /** @function clear - reset the Objects options */
  clear(){
    _.each(defaultOptions, opt => {
      this.options[opt] = defaultOptions[opt];
    })
  }

  toString() {
    return this._build().urlString;
  }

  // @TODO create host() pathPrefix() port() etc

}

module.exports = URLBuilder;
