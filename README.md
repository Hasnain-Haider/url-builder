# url-buildr

**Author:** Hasnain-Haider

**Overview:** This object assembles URLs and routes

An NPM package:

Quickly assemble routes and urls. Can be used for a variety of purposes like

* Route Generation
* API testing
* Webcrawling/scraping
* etc.

_____________________________________________

There are two ways to use this module
1. Instantiate the object with an 'options' object
    * if this method is used, you **MUST pass an object with a defined host** to the constructor
2. Instantiate with a string
    * **Some features are disabled in this method**
    * the URLs are generated with object chaining

```javascript
  options = {
    prefix: (string),
    pathPrefix: (string),
    additions: (string|string[]),
    port: (integer|string),
    host: (string),
    params: (string[]|object),    // [key1,val1, key2,val2] OR {key1:val1, key2:val2}
    queries: (string[]|object)    // (Same as above)
  }
```
  _____________________________________________

### Examples
  Here's a quick example showing the first way
  ```javascript
  ub = new UB({
    prefix: 'https://',
    pathPrefix: '/accounts',
    additions: ['users', ':userId', 'cart'],
    port: 65132,
    params: {
      userId: 54298
    },
    host: 'thegreatsite.co',
    queries: {
      showAllPurchases: true
    }
  });
  ```
  When toString() is called the following string is returned: https://thegreatsite.co:65132/accounts/users/54298/cart?showAllPurchases=true

  Example producing the same url as above using the chaining method:
  ```javascript
  ub = new UB('https://thegreatsite.co:65132')
           .add('accounts', 'users', ':userId', 'cart')
           .query({showAllPurchases: true})
           .param({userId: 54298});
  ```

  The object can be reused by using set()
  
_____________________________________________
## API:

### Class: URLBuildr
Creates an object to create urls

### URLBuildr.constructor(initializer)

**Parameters**

**initializer**: `object|string`, { options } OR the initial URL

**Returns**: this

### URLBuildr.set(opt)

Assign a value to the given options field

**Parameters**

**opts**: `object`, set fields in the options object of "this"

**Returns**: this

e.g. `ub.set({host: 3000})`

### URLBuildr.setOptions(options)

Overwrites the entire options object of "this"

**Parameters**

**options**: `object`, Object containing configurations for the url

**Returns**: this

### URLBuildr.add(paths)

Adds to url path, after the prefix, host, port and pathPrefix

**Parameters**

**paths**: `...string|string[]`, Creates an object to create urls

**Returns**: this

e.g. `ub.add('accounts', 'users')` || `ub.add(['accounts', 'users'])`

### URLBuildr.param(params)

Fills in parameters in the url if they are present

**Parameters**

**params**: `string[]|...string|object`, pass a string array, object, or several strings

**Returns**: this

e.g.
```javascript
ub.param([key1, val1, key2, val2]);
ub.param(key1, val1, key2, val2);
ub.param({
    key1: val1,
    key2: val2
});
```

#### URLBuildr.query(query)

Insert query strings at the end of the url

**Parameters**

**query**: `string[]|..string|object`, pass a string array, object, or several strings

**Returns**: this


#### URLBuildr.clear()

reset the Object options()

#### URLBuildr.toString()

Returns the constructed URL

**Returns**: `string`, urlString
