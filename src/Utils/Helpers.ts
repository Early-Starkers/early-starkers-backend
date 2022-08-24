/**
 * Converts the given HEX value to ASCII
 *
 * @param hex HEX value to be converted
 * @returns ASCII representation of the HEX input
 */
export const HexToAscii = (hex: string | number): string => {
  // Split by 2 chars
  const splitted = hex.toString().match(/.{1,2}/g);

  if (splitted) {
    return splitted.reduce((acc, curr) => String.fromCharCode(parseInt(curr, 16)), '');
  }

  return '';
};

/**
 * Converts the given ASCII value to HEX
 *
 * @param str ASCII value to be converted
 * @returns HEX representation of the ASCII input
 */
export const AsciiToHex = (str: string): string => {
  return `0x${str
    .split('')
    .map((char) => Number(char.charCodeAt(0)).toString(16))
    .join('')}`;
};
