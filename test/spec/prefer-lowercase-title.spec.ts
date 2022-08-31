import * as dedent from 'dedent';
import rule from '../../src/rules/prefer-lowercase-title';
import { runRuleTester } from '../utils/rule-tester';

const invalid = (code: string, output: string, method: string) => ({
  code,
  output,
  errors: [{ messageId: 'unexpectedLowercase', data: { method } }],
});

runRuleTester('prefer-lowercase-title', rule, {
  valid: [
    'randomFunction()',
    'foo.bar()',
    "test('foo Bar', () => {})",
    'test(`foo`, () => {})',
    'test("<Foo/>", () => {})',
    'test("123 foo", () => {})',
    'test("42", () => {})',
    'test(``, () => {})',
    'test("", () => {})',
    'test(42, () => {})',
    "test.fixme('foo', () => {})",
    "test.skip('foo', () => {})",
    "test.only('foo Bar', () => {})",
    'test["fixme"]("foo", () => {})',
    'test["skip"](`foo`, () => {})',
    'test.describe()',
    "test.describe('foo Bar', () => {})",
    'test.describe(`foo`, () => {})',
    'test["describe"]("<Foo/>", () => {})',
    'test[`describe`]("123 foo", () => {})',
    'test.describe("42", () => {})',
    'test.describe(``)',
    'test.describe("")',
    'test.describe(42)',
    "test.describe.skip('foo Bar', () => {})",
    'test.describe.skip(`foo`, () => {})',
    "test.describe.fixme('foo', () => {})",
    "test.describe.only('foo', () => {})",
    "test.describe.parallel.skip('foo Bar', () => {})",
    'test.describe.parallel.skip(`foo`, () => {})',
    "test.describe.parallel.fixme('foo', () => {})",
    "test.describe.parallel.only('foo Bar Baz', () => {})",
    "test.describe.serial.skip('foo', () => {})",
    "test.describe[`serial`].fixme('foo', () => {})",
    "test.describe['serial'].only('foo', () => {})",
  ],
  invalid: [
    invalid("test('Foo',  () => {})", "test('foo',  () => {})", 'test'),
    invalid('test(`Foo bar`,  () => {})', 'test(`foo bar`,  () => {})', 'test'),
    invalid(
      "test.skip('Foo Bar',  () => {})",
      "test.skip('foo Bar',  () => {})",
      'test'
    ),
    invalid(
      'test.skip(`Foo`,  () => {})',
      'test.skip(`foo`,  () => {})',
      'test'
    ),
    invalid(
      "test['fixme']('Foo',  () => {})",
      "test['fixme']('foo',  () => {})",
      'test'
    ),
    invalid(
      'test[`only`](`Foo`,  () => {})',
      'test[`only`](`foo`,  () => {})',
      'test'
    ),
    invalid(
      "test.describe('Foo bar',  () => {})",
      "test.describe('foo bar',  () => {})",
      'test.describe'
    ),
    invalid(
      'test[`describe`](`Foo Bar`,  () => {})',
      'test[`describe`](`foo Bar`,  () => {})',
      'test.describe'
    ),
    invalid(
      "test.describe.skip('Foo',  () => {})",
      "test.describe.skip('foo',  () => {})",
      'test.describe'
    ),
    invalid(
      'test.describe.fixme(`Foo`,  () => {})',
      'test.describe.fixme(`foo`,  () => {})',
      'test.describe'
    ),
    invalid(
      'test[`describe`]["only"]("Foo",  () => {})',
      'test[`describe`]["only"]("foo",  () => {})',
      'test.describe'
    ),
    invalid(
      "test.describe.parallel.skip('Foo',  () => {})",
      "test.describe.parallel.skip('foo',  () => {})",
      'test.describe'
    ),
    invalid(
      'test.describe.parallel.fixme(`Foo`,  () => {})',
      'test.describe.parallel.fixme(`foo`,  () => {})',
      'test.describe'
    ),
    invalid(
      'test.describe.parallel.only("Foo",  () => {})',
      'test.describe.parallel.only("foo",  () => {})',
      'test.describe'
    ),
    invalid(
      "test.describe.serial.skip('Foo',  () => {})",
      "test.describe.serial.skip('foo',  () => {})",
      'test.describe'
    ),
    invalid(
      'test.describe.serial.fixme(`Foo`,  () => {})',
      'test.describe.serial.fixme(`foo`,  () => {})',
      'test.describe'
    ),
    invalid(
      'test.describe.serial.only("Foo",  () => {})',
      'test.describe.serial.only("foo",  () => {})',
      'test.describe'
    ),
  ],
});

runRuleTester('prefer-lowercase-title with ignore=test.describe', rule, {
  valid: [
    {
      code: "test.describe('Foo', () => {})",
      options: [{ ignore: ['test.describe'] }],
    },
    {
      code: 'test.describe.parallel(`Foo`, () => {})',
      options: [{ ignore: ['test.describe'] }],
    },
    {
      code: 'test.describe.skip(`Foo`, () => {})',
      options: [{ ignore: ['test.describe'] }],
    },
  ],
  invalid: [
    {
      code: "test('Foo', () => {})",
      output: "test('foo', () => {})",
      options: [{ ignore: ['test.describe'] }],
      errors: [{ messageId: 'unexpectedLowercase', data: { method: 'test' } }],
    },
  ],
});

runRuleTester('prefer-lowercase-title with ignore=test', rule, {
  valid: [
    {
      code: "test('Foo', () => {})",
      options: [{ ignore: ['test'] }],
    },
    {
      code: 'test(`Foo`, () => {})',
      options: [{ ignore: ['test'] }],
    },
    {
      code: 'test.only(`Foo`, () => {})',
      options: [{ ignore: ['test'] }],
    },
  ],
  invalid: [
    {
      code: "test.describe('Foo', () => {})",
      output: "test.describe('foo', () => {})",
      options: [{ ignore: ['test'] }],
      errors: [
        {
          messageId: 'unexpectedLowercase',
          data: { method: 'test.describe' },
        },
      ],
    },
  ],
});

runRuleTester('prefer-lowercase-title with allowedPrefixes', rule, {
  valid: [
    {
      code: "test('GET /live', () => {})",
      options: [{ allowedPrefixes: ['GET'] }],
    },
    {
      code: 'test("POST /live", () => {})',
      options: [{ allowedPrefixes: ['GET', 'POST'] }],
    },
    {
      code: 'test(`PATCH /live`, () => {})',
      options: [{ allowedPrefixes: ['GET', 'PATCH'] }],
    },
  ],
  invalid: [
    {
      code: 'test(`POST /live`, () => {})',
      output: 'test(`pOST /live`, () => {})',
      options: [{ allowedPrefixes: ['GET'] }],
      errors: [{ messageId: 'unexpectedLowercase', data: { method: 'test' } }],
    },
  ],
});

runRuleTester('prefer-lowercase-title with ignoreTopLevelDescribe', rule, {
  valid: [
    {
      code: 'describe("MyClass", () => {});',
      options: [{ ignoreTopLevelDescribe: true }],
    },
    {
      code: dedent`
        test.describe('MyClass', () => {
          test.describe('#myMethod', () => {
            test('does things', () => {});
          });
        });
      `,
      options: [{ ignoreTopLevelDescribe: true }],
    },
  ],
  invalid: [
    {
      code: 'test("Works!", () => {});',
      output: 'test("works!", () => {});',
      options: [{ ignoreTopLevelDescribe: true }],
      errors: [
        {
          messageId: 'unexpectedLowercase',
          data: { method: 'test' },
        },
      ],
    },
    {
      code: dedent`
        test.describe('MyClass', () => {
          test.describe('MyMethod', () => {
            test('Does things', () => {});
          });
        });
      `,
      output: dedent`
        test.describe('MyClass', () => {
          test.describe('myMethod', () => {
            test('does things', () => {});
          });
        });
      `,
      options: [{ ignoreTopLevelDescribe: true }],
      errors: [
        {
          messageId: 'unexpectedLowercase',
          data: { method: 'test.describe' },
          column: 17,
          line: 2,
        },
        {
          messageId: 'unexpectedLowercase',
          data: { method: 'test' },
          column: 10,
          line: 3,
        },
      ],
    },
  ],
});