/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2025 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the Sonar Source-Available License Version 1, as published by SonarSource SA.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the Sonar Source-Available License for more details.
 *
 * You should have received a copy of the Sonar Source-Available License
 * along with this program; if not, see https://sonarsource.com/license/ssal/
 */
import { rule } from './index.js';
import { DefaultParserRuleTester, RuleTester } from '../../../tests/tools/testers/rule-tester.js';
import { describe, it } from 'node:test';

describe('S6439', () => {
  it('S6439', () => {
    new RuleTester().run('', rule, {
      valid: [
        {
          code: `
        const Component = (count, collection) => {
          count = 1;
          return (
            <div>
              {count && <List elements={collection} />}
            </div>
          )
        }
      `,
        },
        {
          code: `
        const Component = (count: boolean, collection) => {
          return (
            <div>
              {count && <List elements={collection} />}
            </div>
          )
        }
      `,
        },
        {
          code: `
        const Component = (collection) => {
          let test = '';
          return (
            <div>
              {test && <List elements={collection} />}
            </div>
          )
        }
      `,
        },
      ],
      invalid: [
        {
          code: `
        const Component = (count: number, collection) => {
          return (
            <div>
              {count && <List elements={collection} />}
            </div>
          )
        }
      `,
          errors: [
            {
              message: 'Convert the conditional to a boolean to avoid leaked value',
              line: 5,
              column: 16,
              endLine: 5,
              endColumn: 21,
              suggestions: [
                {
                  desc: 'Convert the conditional to a boolean',
                  output: `
        const Component = (count: number, collection) => {
          return (
            <div>
              {!!(count) && <List elements={collection} />}
            </div>
          )
        }
      `,
                },
              ],
            },
          ],
        },
        {
          code: `
        const Component = (collection) => {
          const count = 0;
          return (
            <div>
              {count && <List elements={collection} />}
            </div>
          )
        }
      `,
          errors: [
            {
              message: 'Convert the conditional to a boolean to avoid leaked value',
              line: 6,
              column: 16,
              endLine: 6,
              endColumn: 21,
              suggestions: [
                {
                  desc: 'Convert the conditional to a boolean',
                  output: `
        const Component = (collection) => {
          const count = 0;
          return (
            <div>
              {!!(count) && <List elements={collection} />}
            </div>
          )
        }
      `,
                },
              ],
            },
          ],
        },
        {
          code: `
        const Component = (collection: Array<number>) => {
          return (
            <div>
              {collection.length && <List elements={collection} />}
            </div>
          )
        }
      `,
          errors: [
            {
              message: 'Convert the conditional to a boolean to avoid leaked value',
              line: 5,
              column: 16,
              endLine: 5,
              endColumn: 33,
              suggestions: [
                {
                  desc: 'Convert the conditional to a boolean',
                  output: `
        const Component = (collection: Array<number>) => {
          return (
            <div>
              {!!(collection.length) && <List elements={collection} />}
            </div>
          )
        }
      `,
                },
              ],
            },
          ],
        },
        {
          code: `
        const Component = (test: number, count: number, collection) => {
          return (
            <div>
              {(test || (count)) && <List elements={collection} />}
            </div>
          )
        }
      `,
          errors: [
            {
              message: 'Convert the conditional to a boolean to avoid leaked value',
              line: 5,
              column: 17,
              endLine: 5,
              endColumn: 21,
              suggestions: [
                {
                  desc: 'Convert the conditional to a boolean',
                  output: `
        const Component = (test: number, count: number, collection) => {
          return (
            <div>
              {(!!(test) || (count)) && <List elements={collection} />}
            </div>
          )
        }
      `,
                },
              ],
            },
            {
              message: 'Convert the conditional to a boolean to avoid leaked value',
              line: 5,
              column: 26,
              endLine: 5,
              endColumn: 31,
              suggestions: [
                {
                  desc: 'Convert the conditional to a boolean',
                  output: `
        const Component = (test: number, count: number, collection) => {
          return (
            <div>
              {(test || !!(count)) && <List elements={collection} />}
            </div>
          )
        }
      `,
                },
              ],
            },
          ],
        },
        {
          code: `
        import react from 'react-native';
        const Component = (collection) => {
          let test = '';
          return (
            <div>
              {test && <List elements={collection} />}
            </div>
          )
        }
      `,
          errors: 1,
        },
        {
          code: `
        const react = require('react-native');
        const Component = (collection) => {
          let test = '';
          return (
            <div>
              {test && <List elements={collection} />}
            </div>
          )
        }
      `,
          errors: 1,
        },
      ],
    });

    new DefaultParserRuleTester().run('', rule, {
      valid: [
        {
          code: `
        const Component = (collection) => {
          const count = 0;
          return (
            <div>
              {count && <List elements={collection} />  /*OK, no type information available*/ }
            </div>
          )
        }
        `,
        },
      ],
      invalid: [],
    });
  });
});
