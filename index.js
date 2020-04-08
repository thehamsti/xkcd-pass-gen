/**
 * Random Password Generator - Based on XKPasswd - Bart Busschots <https://xkpasswd.net>
 * @author John Cummings <jack@jackc.io>
 * @description Random password generator password with many different parameters
 * @version 0.1.0
 */

// TODO: Setup ESLint or Prettier (investigate which one)

const { generatePassword } = require('./lib/generators');

/**
 * Gnerate passwords handler
 * @param {Object} p - Object of parameters
 */
const genPasswords = async (options) => {
  const DEFAULTS = {
    numPasswords: 1,
    numWords: 2,
    minLength: 4,
    maxLength: 4,
    sepType: 'none',
    sep: '-',
    wCase: 'alt',
    padDigBe: 0,
    padDigAf: 2,
    padsType: 'none',
    padsAmount: 2,
    pads: '$',
    noBadwords: true,
  };

  // eslint-disable-next-line no-param-reassign
  options = Object.assign(DEFAULTS, options);

  if (options.minLength > options.maxLength) throw new Error('minLength must be shorter then maxLength');
  if (options.numWords < 0 || options.minLength < 0 || options.maxLength < 0
    || options.padDigBe < 0 || options.padDigAf < 0 || options.padsAmount < 0) {
    throw new Error('Invalid parameters given. Parameters cannot be negative');
  }

  let passwordArray = [];
  try {
    for (let i = 0; i < options.numPasswords; i += 1) {
      passwordArray.push(generatePassword(options.numWords, options.minLength, options.maxLength,
        options.sepType, options.sep, options.wCase, options.padDigBe, options.padDigAf,
        options.padsType, options.padsAmount, options.pads, options.noBadwords));
    }
  } catch (e) {
    console.log(e);
    return e;
  }

  passwordArray = await Promise.all(passwordArray);

  if (passwordArray.length > 1) {
    return passwordArray;
  }
  return passwordArray[0];
};

module.exports = genPasswords;
