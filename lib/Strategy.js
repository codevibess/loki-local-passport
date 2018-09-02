
const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;

const loki = require('lokijs');
const colors = require('colors');



const utils = require('./utils');




const database = new loki('database.json', {
  autoload: true,
  autosave: true,
  autosaveInterval: 5000,
});

function getCollectionInstance() {
  let users = database.getCollection('users');
  if (users === null) {
    users = database.addCollection('users');
    console.log('Database was created'.green);
  }
  return users;
}


passport.serializeUser((user, done) => {
  console.log('Serialize User');
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Deserialize User');
  const users = getCollectionInstance();
  const user = utils.unpackArray(users.find({ id }));
  if (id === user.id) {
    return done(null, user);
  }
});

function lokiLocalLogIn(req, res, next) {
  const { options } = res.locals;
  passport.use(
    'loki-local-login',
    new CustomStrategy((req, done) => {
      const users = getCollectionInstance();
      const user = utils.unpackArray(users.find({ id: req.body.id }));

      if (!user) {
        if (options.mode === 'debug') console.log('No user found'.red);
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }

      if (user && utils.validPassword(req.body.password, user.password)) {
        if (options.mode === 'debug') console.log('Succesfully log in'.green);
        done(null, user);
      } else {
        if (options.mode === 'debug') console.log('Unauthorized'.red);
        done(null, false);
      }
    })
  );
  passport.authenticate('loki-local-login')(req, res, next);
  return database;
}

function lokiLocalSignUp(req, res, next) {
  const { options } = res.locals;
  passport.use(
    'loki-local-signup',
    new CustomStrategy((req, done) => {
      const users = getCollectionInstance();
      let user = utils.unpackArray(users.find({ id: req.body.id }));

      if (user && req.body.id === user.id) {
        if (options.mode === 'debug') console.log('That email is already taken'.red);
        return done(null, false);
      }

      user = {
        id: req.body.id,
        password: utils.generateHash(req.body.password),
        name: req.body.name || 'custom',
        surname: req.body.surname || 'custom',
        email: req.body.email || 'custom',
        number: req.body.number || 'custom',
        sex: req.body.sex || 'custom',
        age: req.body.age || 'custom',
        country: req.body.country || 'custom',
      };

      users.insert(user);
      database.saveDatabase();
      if (options.mode === 'debug') console.log('User account succesfully created'.green);
      return done(null, user);
    })
  );
  passport.authenticate('loki-local-signup')(req, res, next);
}
function use(action, options = { mode: 'production' }) {
  if (action === 'signup') {
    return (req, res, next) => {
      res.locals.options = options;
      if (options.mode === 'debug') console.log(`action: ${action}`.blue);
      lokiLocalSignUp(req, res, next);
      next();
    };
  }
  if (action === 'login') {
    return (req, res, next) => {
      res.locals.options = options;
      if (options.mode === 'debug') console.log(`action: ${action}`.blue);
      lokiLocalLogIn(req, res, next);
      next();
    };
  }
  if (action !== 'login' || action !== 'signup') {
    console.log(
      'Action doesn`t recognize.Choose one of the available:' +
        'login'.blue +
        'or' +
        'signup'.blue
    );
  }
}



module.exports = {
  use,
};
