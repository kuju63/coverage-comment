import {MessageBuilder} from '../src/messageBuilder'

test('Header only', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Package Name | Class Name | Method Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | ---------- | ------------ | --------------: | ----------------: |'
  expect(builder.toString()).toBe(msg)
})

test('Single line', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Package Name | Class Name | Method Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | ---------- | ------------ | --------------: | ----------------: |\n' +
    '| sample |  |  | 22.2 | 33.3 |'
  expect(builder.appendCoverage('sample', '', '', 22.2, 33.3).toString()).toBe(
    msg
  )
})

test('Multiple line', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Package Name | Class Name | Method Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | ---------- | ------------ | --------------: | ----------------: |\n' +
    '| sample |  |  | 22.2 | 33.3 |\n' +
    '| sample2 |  |  | 11.1 | 12.3 |'
  expect(
    builder
      .appendCoverage('sample', '', '', 22.2, 33.3)
      .appendCoverage('sample2', '', '', 11.1, 12.3)
      .toString()
  ).toBe(msg)
})

test('Class and method coverage', () => {
  const builder = new MessageBuilder('Header')
  const msg =
    'Header\n' +
    '| Package Name | Class Name | Method Name | Line rate (avg) | Branch rate (avg) |\n' +
    '| :---------- | ---------- | ------------ | --------------: | ----------------: |\n' +
    '| sample |  |  | 22.2 | 33.3 |\n' +
    '| sample | Foo |  | 11.1 | 12.3 |\n' +
    '| sample | Foo | Bar | 33.3 | 44.4 |'
  expect(
    builder
      .appendCoverage('sample', '', '', 22.2, 33.3)
      .appendCoverage('sample', 'Foo', '', 11.1, 12.3)
      .appendCoverage('sample', 'Foo', 'Bar', 33.3, 44.4)
      .toString()
  ).toBe(msg)
})
