/**
 * a function to reverse string. if the parameter is not a string or empty, it will return an empty string
 *
 * @param text - The string to reverse
 * @returns The reversed string
 */
export default (text: string) => (text ? text.split('').reverse().join('') : '')
