# url-buildr

**Author:** Hasnain-Haider

**Overview:** This object assembles URLs and routes

An NPM package:

Quickly assemble routes and urls. Can be used for a variety of purposes like

* route generation
* api testing
* webcrawling/scraping
* etc.

_____________________________________________

There are two ways to use this module
1. Instantiate the object with an 'options' object
    * if this method is used, you **MUST pass an object with a defined host** to the constructor
2. Instantiate with a string
    * **Some features are disabled in this method**
    * the URLs are generated with object chaining

```
  options = {
    prefix: (string),
    pathPrefix: (string),
    additions: (string|string[]),
    port: (integer|string),
    host: (string),
    params: (string[]|object),    // [key1,val1,key2,val2] OR {key1:val1,key2:val2}
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
  The above will turn into: https://thegreatsite.co:65132/accounts/users/54298/cart?showAllPurchases=true

  Example producing the same url as above using the chaining method:
  ```javascript
  ub = new UB('https://thegreatsite.co:65132')
           .add('accounts', 'users', ':userId', 'cart')
           .query({showAllPurchases: true})
           .param({userId: 54298});
  ```

_____________________________________________
## API:

### Class: URLBuildr
Creates an object to create urls

#### URLBuildr.constructor - reassign a property of options(opt, val)

Assign a value to a given options field

**Parameters**

**opt**: `object|string`, the field of option to reassign

**Returns**: this

#### URLBuildr.set - reassign a property of options(opt, val)

Assign a value to a given options field

**Parameters**

**opt**: `string`, the field of option to reassign

**val**: `string`, The value to give to the field

**Returns**: this

#### URLBuildr.setOptions - overwrite the entire options object(options)

Assigns a value to options

**Parameters**

**options**: `object`, Creates an object to create urls

**Returns**: this

#### URLBuildr.add - fills in parameters(params)

Adds to url path, after the prefix, host, port and pathPrefix

**Parameters**

**params**: `string | string | Array.&lt;string&gt;`, Creates an object to create urls


#### URLBuildr.param - fills in parameters(params)

Fills in parameters in the url if they are present

**Parameters**

**params**: `iterable`, Creates an object to create urls


#### URLBuildr.query - fills in parameters(params)

Insert query strings at the end of the url

**Parameters**

**params**: `iterable`, Creates an object to create urls


#### URLBuildr.clear - reset the Objects options()

Clears all the options


#### URLBuildr.toString()

Returns the constructed URL

**Returns**: `string`, urlString
