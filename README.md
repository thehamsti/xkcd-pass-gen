# XKCD-based Password Generator - Based on XKPasswd - Bart Busschots <https://xkpasswd.net>
Generates a password based on parameters.

## Install

To install in your projects:

```
npm install --save xkcd-pass-gen
```

## Usage

### Options
| Name  | Type  |  Optional | Default  | Description  |
|---|---|---|---|---|
| numPasswords | int  | True  | 1  | Number of passwords to be generated |
| numWords | int | True  | 2 | Number of words in each generated password |
| minLength | int | True | 4 | Minimum length of word generated |
| maxLength | int | True | 4 | Maximum length of word generated |
| sepType | string | True | 'none' | none [none], specified [spec](specific character specified in .sep), random character [rand](random character from array of characters given in .sep) |
| sep | string/array | True | '-' | Character(s) to be used as separators. Either single character or array depending on separator type |
| wCase | string | True | 'alt' | Word case. Options: Alternating [alt], First Letter [first], lowercase [lower], uppercase [upper], capitalize every letter except the first [except] |
| padDigBe | int | True | 0 | Number of digits to add at the front |
| padDigAf | int | True | 2 | Number of digits to add at the end |
| padsType | int | True | 'none' | Padding to end symbol type. Options: none [none], specified [spec], random symbol [rand] |
| padsLoc | int | True | 'end' | Padding symbol location. Will only be used if padsType is set to something other than none. Options: beginning [beg], end [end], both [both] |
| padsAmount | int | True | 2 | Number of symbol characters to be added. Will only be used if padsType is set to something other than none. |
| pads | int | True | '$' | Symbol(s) to be used as padding. Either single character or array depending on separator type. |

### Example
```js
const genPasswords = require('xkcd-pass-gen');
 
// Passing in nothing will print default wordWORD##
genPasswords().then((result) => {
  console.log(result);
});

// Passing in some parameters
const options = {
  numPasswords: 4,
  numWords: 3,
  minLength: 2,
  maxLength: 4,
};

genPasswords(options).then((result) => {
  console.log(result);
});
```

## Lambda
You can create a nodejs lambda function with the lambda folder.

## Questions?
* Found a bug or just have a question? [Open an](https://github.com/jctrvlr/xkcd-pass-gen/issues/new) issue here on Github!
* Tweet at me [@thecuriouseng](https://twitter.com/thecuriouseng) 
