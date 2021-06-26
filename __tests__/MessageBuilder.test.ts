import {MessageBuilder} from '../src/MessageBuilder'

test('Header only', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Module Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | --------------: | ----------------: |'
  expect(builder.toString()).toBe(msg)
})

test('Single line', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Module Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | --------------: | ----------------: |\n' +
    '| sample | 22.2 | 33.3 |'
  expect(builder.appendCoverage('sample', 22.2, 33.3).toString()).toBe(msg)
})

test('Multiple line', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Module Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | --------------: | ----------------: |\n' +
    '| sample | 22.2 | 33.3 |\n' +
    '| sample2 | 11.1 | 12.3 |'
  expect(
    builder
      .appendCoverage('sample', 22.2, 33.3)
      .appendCoverage('sample2', 11.1, 12.3)
      .toString()
  ).toBe(msg)
})
