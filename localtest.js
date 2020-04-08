const genPasswords = require('./index');

// Passing in nothing will print default wordWORD##
genPasswords().then((result) => {
  console.log(result);
});

// Passing in some parameters - numPasswords=4, numWords=3, minLength=2, maxLength=4
const options = {
  numPasswords: 4,
  numWords: 3,
  minLength: 2,
  maxLength: 4,
};

genPasswords(options).then((result) => {
  console.log(result);
});
