# loki-local-passport


is a custom strategy that simplifies  authenticating with Passport using id and password.

This strategy use persistent in-memory JavaScript Datastore - [LokiJS](https://www.npmjs.com/package/lokijs) instead of large NoSQL DB like a MongoDB what give for us amazing *performance*.

# Intro


This module give your posibility quickly handle user auth without painfull dev work like configuration and other stuff. Everything what you need is 3 line.&nbsp;
Three line Carl!&nbsp;
You will say but why i need it? It's a simple answer : &nbsp;
Imagine that your are at hackaton and make a prototype of your app. Where you will spend more time in auth module or at the logic of your future startup (I hope you do).

Also this module will be helpfull in a
* petty projects
* university projects
* non-production projects and even more.

# Installation

```javascript
npm install passport-local-sequelize
```

# Usage

As every passport strategy this one need: 
* [body-parser](https://www.npmjs.com/package/body-parser)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [express-session](https://www.npmjs.com/package/express-session)
* and also [connect-flash](https://www.npmjs.com/package/connect-flash) for send flash messages to user

Install this packadges  require them and use:

Require all this stuff needed for passport:
```javascript
const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'mistery' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
```

Require installed module (LokiLocal)
```javascript
const LokiLocal = require('loki-local-passport');
```

Add the middleware function LokiLokal.use() to your routes. Example:
```javascript
app.post(
    '/login',
    LokiLocal.use('login')
  );
  
  app.post(
      '/signup',
      LokiLocal.use('signup')
    );
  ```
That`s all what you need to start use it.

If you want control what is going on your can add to middleware LokiLokal.use() object with debug mode. Example: 
```javascript
app.post(
    '/login',
    LokiLocal.use('login', { mode: 'debug' })
  );
  
  app.post(
      '/signup',
      LokiLocal.use('signup',{ mode: 'debug' })
    );
  ```
It will print in console all actions.

All of this fields can be placed in your signup form (if not it will have value *custom*):
* id *required*
* password *required*
* name
* surname
* email
* number
* sex
* age
* country



# Example of simple app :

```javascript
const express = require('express');

const passport = require('passport');
const LokiLocal = require('loki-local-passport');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
 


const app = express();
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'mistery' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
 
 
app.post(
    '/login',
    LokiLocal.use('login')
  );
  
app.post(
      '/signup',
      LokiLocal.use('signup')
    );
  
 
 
 
app.listen(8080, () => {
  console.log('Started at the port 8080');
});
```
