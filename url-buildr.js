const _ = require('underscore');
const defaultOptions = require('./defaults.json');

// options additions queries params http||https host port urlPrefix
class URLBuilder {
  constructor(initializer) {
    this.urlString = '';
    this.isBuilt = false;
    this.hasQuery = false;

    this.queries = [];
    this.params = [];
    this.additions = [];

    let initype = typeof initializer;
    if (initype === 'string') {
      this.urlString = URLBuilder._sanitizeString(initializer);
    } else if (initype === 'object') {
      this._buildOptions(initializer);
    }
  }

/*************************  Constructor Helper  *****************************/
  _buildOptions(options) {
    _.defaults(options, defaultOptions);
    var url = `${options.prefix}${options.host}`;
    url += options.port ? `:${options.port}` : '';
    url += options.urlPrefix ? `/${options.urlPrefix}` : '';

    this.additions = options.additions;
    this.queries = URLBuilder._accumulate(options.queries);
    this.params = URLBuilder._accumulate(options.params);
  }

  /************************ Private Static Methods ***************************/
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

  /************************ Private Instance Methods ***************************/
    _build() {
      if (!this.isBuilt) {
        this
        ._buildAdditions()
        ._buildParams()
        ._buildQueries();
        this.isBuilt = true;
      }
      return this;
    }

  _buildAdditions() {
    _.each(this.additions, (addition) => {
      this.urlString += `/${addition}`;
    });
    return this;
  }

  _buildParams() {
    _.each(this.params, (pair) => {
      const regex = new RegExp(':' + _.first(pair) + '(?=[/\0])')
      this.urlString = this.urlString.replace(regex, _.last(pair));
    });
    return this;
  }

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

  /***************************** Public Methods *********************************/
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

  toString() {
    return this._build().urlString;
  }
}

module.exports = URLBuilder;
