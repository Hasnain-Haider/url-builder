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
1. Object passing and setting options
  * if you use this method you **MUST pass an object with a defined host** to the constructor
2. String passing
  * **Many features are disabled in this method**
  * the URLs are generator with object chaining

## API
_____________________________________________

## Class: URLBuildr
Creates an object to create urls

### URLBuildr.set - reassign a property of options(opt, val)

Creates an object to create urls

**Parameters**

**opt**: `string`, the field of option to reassign

**val**: `string`, The value to give to the field

**Returns**: this

### URLBuildr.setOptions - overwrite the entire options object(options)

Creates an object to create urls

**Parameters**

**options**: `object`, Creates an object to create urls

**Returns**: this

### URLBuildr.add - fills in parameters(params)

Creates an object to create urls

**Parameters**

**params**: `string | string | Array.&lt;string&gt;`, Creates an object to create urls


### URLBuildr.param - fills in parameters(params)

Creates an object to create urls

**Parameters**

**params**: `iterable`, Creates an object to create urls


### URLBuildr.query - fills in parameters(params)

Creates an object to create urls

**Parameters**

**params**: `iterable`, Creates an object to create urls


### URLBuildr.clear - reset the Objects options()

Creates an object to create urls


### URLBuildr.toString()

Creates an object to create urls

**Returns**: `string`, urlString

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
