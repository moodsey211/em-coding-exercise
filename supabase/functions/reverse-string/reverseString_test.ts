import { expect } from 'jsr:@std/expect'
import reverseString from './reverseString.ts'

Deno.test('reverseString', () => {
  const samples = {
    hello: 'olleh',
    '': '',
    '123': '321',
    '12345': '54321',
    '123456': '654321',
    a: 'a',
    ab: 'ba',
    abc: 'cba',
    abcd: 'dcba',
    abcde: 'edcba',
    abcdef: 'fedcba',
    abcdefg: 'gfedcba'
  }

  for (const [input, expected] of Object.entries(samples)) {
    expect(reverseString(input)).toBe(expected)
  }
})
