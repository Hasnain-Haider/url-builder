# url-buildr
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
constructor()
query()

param()
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

Here's an example using chaining:
```javascript
ub = new UB('https://thegreatsite.co:65132')
         .add('accounts', 'users', ':userId', 'cart')
         .query({showAllPurchases: true})
         .param({userId: 54298});
```
