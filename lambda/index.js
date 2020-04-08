/* eslint-disable no-unused-vars */
/**
 * Random Password Generator - Lambda Edition - Based on XKPasswd - Bart Busschots <https://xkpasswd.net>
 * @author John Cummings <jack@jackc.io>
 * @description Random password generator password with many different parameters
 * @version 0.1.0
 */

// TODO: Setup ESLint or Prettier (investigate which one)
// TODO: Move some functions to library files possible?
// TODO: If minlength is set to higher then default max length put maxlength to minlength
// TODO: If minlength is higher then given maxlength return error

const rng = require('random-number-csprng');
const badWords = require('badwords/array');

const sendRes = require('./lib/sendRes');

const symbols = '~!@#$%^&*-+/?';

/**
 * Generate random word
 * @param {number} minLength - min length of word
 * @param {number} maxLength - max length of word
 */
const genRandomWord = async (wordList) => {
  let n;
  try {
    n = await rng(0, wordList.length - 1);
  } catch (e) {
    console.log(e);
  }
  return wordList[n];
};

const getWords = async (numWords, minLength, maxLength, noBadWords) => {
  const words = [];
  // Filter out entire word array with words between min/max length
  let wordList = words.filter((w) => w.length >= minLength && w.length <= maxLength);
  if (noBadWords) wordList = wordList.filter((w) => badWords.indexOf(w) === -1);

  try {
    for (let i = 0; i < numWords; i += 1) {
      words.push(genRandomWord(minLength, maxLength));
      // TODO: Create catch clause
    }
  } catch (e) {
    console.log(e);
  }
  return Promise.all(words);
};

/**
 * Generate password based on parameters
 * @param {number} numWords [numWords=2] - Number of words to include in password
 * @param {number} minLength [minLength=4] - Minimum length of word to generate
 * @param {number} maxLength [maxLength=4] - Maximum length of word to generate
 * @param {string} sepType [sepType="none"] - Separator type: none (no separator),
 *                                   specified [spec](specific character specified in .sep),
 *                                   random character [rand](random character from
 *                                   array of characters given in .sep)
 * @param {string/string[]} sep [sep="-"] - Character(s) to be used as separators.
 *                                   Either single character or array depending on separator type
 * @param {string} wCase [wCase="alt"] - Word case. Options: Alternating [alt],
 *                                   First Letter [first], lowercase [lower], uppercase [upper],
 *                                   capitalize every letter except the first [except]
 * @param {number} padDigBe [padDigBe=0] - Number of digits to add at the front
 * @param {number} padDigAf [padDigAf=2] - Number of digits to add at the end
 * @param {string} padsType [padsType="none"] - Padding to end symbol type. Options: none [none],
 *                                   specified [spec], random symbol [rand]
 * @param {string} padsLoc [padsLoc="end"] - Padding symbol location. Will only be used if
 *                                   padsType is set to something other than none. Options:
 *                                   beginning [beg], end [end], both [both]
 * @param {number} padsAmount [padsNum=2] - Number of symbol characters to be added. Will
 *                                   only be used if padsType is set to something other than none.
 * @param {string} pads [pad="$"] - Symbol(s) to be used as padding. Either single character
 *                                   or array depending on separator type.
 */
const generatePassword = async (numWords = 2, minLength = 4, maxLength = 4, sepType = 'none', sep = '-', wCase = 'alt',
  padDigBe = 0, padDigAf = 2, padsType = 'none', padsAmount = 2, pads = '$', noBadwords = true) => {
  let password = '';

  if (numWords < 0 || minLength < 0 || maxLength < 0 || padDigBe < 0
    || padDigAf < 0 || padsAmount < 0) {
    return sendRes(400, 'Invalid parameters given. Parameters cannot be negative');
  }

  const words = await getWords(numWords, minLength, maxLength, noBadwords);

  if (wCase === 'alt') {
    for (let i = 0; i < words.length; i += 1) {
      if (i % 2 === 0) {
        words[i] = words[i].toLowerCase();
      } else {
        words[i] = words[i].toUpperCase();
      }
    }
  } else if (wCase === 'first') {
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
  } else if (wCase === 'lower') {
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i].toLowerCase();
    }
  } else if (wCase === 'upper') {
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i].toUpperCase();
    }
  } else if (wCase === 'eicept') {
    for (let i = 0; i < words.length; i += 1) {
      words[i] = words[i].charAt(0).toLowerCase() + words[i].slice(1).toUpperCase();
    }
  }

  if (padDigBe > 0) {
    const pnum = 10 ** padDigBe - 1;
    const digs = Math.floor(pnum + Math.random() * (pnum * 9));
    password = digs;
  }

  for (let l = 0; l < numWords; l += 1) {
    password += words[l];
    if (sepType !== 'none') {
      let sepchar = '';
      if (sepType === 'rand') {
        const randNum = Math.floor(Math.random() * Math.floor(symbols.length - 1));
        sepchar = symbols.charAt(randNum);
      }
      if (sepType === 'spec') {
        sepchar = sep;
      }
      password += sepchar;
    }
  }
  // TODO: Add padding handlers

  if (padDigAf > 0) {
    const pnum = 10 ** padDigAf - 1;
    const afDigs = Math.floor(pnum + Math.random() * (pnum * 9));
    password += afDigs;
  }
  return password;
};

/**
 * Get passwords handler
 * @param {Object} p - Object of parameters
 * @param {Object} data - Data object that game with request
 */
const getPasswords = async (numPasswords = 1, numWords = 2, minLength = 4, maxLength = 4, sepType = 'none', sep = '-', wCase = 'alt',
  padDigBe = 0, padDigAf = 2, padsType = 'none', padsAmount = 2, pads = '$', noBadWords = true) => {
  const passwordArray = [];
  try {
    for (let i = 0; i < numPasswords; i += 1) {
      passwordArray.push(generatePassword(numWords, minLength, maxLength,
        sepType, sep, wCase, padDigBe, padDigAf,
        padsType, padsAmount, pads));
    }
  } catch (e) {
    console.log(e);
  }
  return sendRes(200, passwordArray);
};

/**
 * Main Handler
 * @param {Object} p - Object of parameters
 * @param {number} p.numPasswords [p.numPasswords=1] - Number of passwords to return
 * @param {number} p.numWords [p.numWords=2] - Number of words to include in password
 * @param {number} p.minLength [p.minLength=4] - Minimum length of word to generate
 * @param {number} p.maxLength [p.maxLength=4] - Maximum length of word to generate
 * @param {string} p.sepType [p.sepType="none"] - Separator type: none (no separator),
 *                                   specified [spec](specific character specified in .sep),
 *                                   random character [rand](random character from
 *                                   array of characters given in .sep)
 * @param {string/string[]} p.sep [p.sep="-"] - Character(s) to be used as separators.
 *                                   Either single character or array depending on separator type
 * @param {string} p.wCase [p.wCase="alt"] - Word case. Options: Alternating [alt], First Letter
 *                                   [first], lowercase [lower], uppercase [upper], capitalize
 *                                   every letter except the first [except]
 * @param {number} p.padDigBe [p.padDigBe=0] - Number of digits to add at the front
 * @param {number} p.padDigAf [p.padDigAf=2] - Number of digits to add at the end
 * @param {string} p.padsType [p.padsType="none"] - Padding to end symbol type.
 *                                   Options: none [none], specified [spec], random symbol [rand]
 * @param {string} p.padsLoc [p.padsLoc="end"] - Padding symbol location. Will only
 *                                   be used if padsType is set to something other
 *                                   than none. Options: beginning [beg], end [end], both [both]
 * @param {number} p.padsAmount [p.padsNum="2"] - Number of symbol characters to be
 *                                   added. Will only be used if padsType is set to something
 *                                   other than none.
 * @param {string} p.pads [p.pad="$"] - Symbol(s) to be used as padding. Either single
 *                                   character or array depending on separator type.
 */
// eslint-disable-next-line no-unused-vars
exports.handler = async (event, _context) => {
  const p = event.queryStringParameters ? event.queryStringParameters : {};

  return getPasswords(p.numPasswords, p.numWords,
    p.minLength, p.maxLength, p.sepType, p.sep, p.wCase, p.padDigBe,
    p.padDigAf, p.padsType, p.padsAmount, p.pads, p.noBadWords);
};
