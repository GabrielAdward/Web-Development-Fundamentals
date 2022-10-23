const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'Gabriel123';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash(myPlaintextPassword, salt, function(err, hash){
    if(err){
      console.log(err)
    }else{
      console.log(hash)
    }
  });
});