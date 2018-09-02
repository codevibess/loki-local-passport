const bcrypt = require('bcrypt-nodejs');

exports.unpackArray = array => array[0];


exports.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);


exports.validPassword = (passwordFromClient, passwordFromdatabase) => {
  return bcrypt.compareSync(passwordFromClient, passwordFromdatabase);
};
