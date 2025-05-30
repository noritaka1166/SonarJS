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
import { RuleTester } from '../../../tests/tools/testers/rule-tester.js';
import { describe, it } from 'node:test';

describe('S4043', () => {
  it('S4043', () => {
    const ruleTester = new RuleTester();
    ruleTester.run('Array-mutating methods should not be used misleadingly.', rule, {
      valid: [
        {
          code: `
        let a = [];
        let d;
      
        // ok
        a.reverse();
        a?.reverse();
        a && a.sort();
        // ok
        d = a.map(() => true).reverse();
        // ok, there is "slice"
        d = a.slice().reverse().forEach(() => {});

        // ok, excluded
        a = a.reverse();
        a = a.sort();
      `,
        },
        {
          code: `const c = [1, 2, 3].reverse();`,
        },
        {
          code: `
          function foo() {
            const keys = [];
            // fill keys...
            return keys.reverse();
          }
          
          function change(s: string): string {
              return s.split("").reverse().join();
          }
          `,
        },
        {
          code: `
          class Bar {
              field: string[];
            
              public method() {
                // ok
                this.field.reverse();
                // ok
                const c = this.getFieldCopy().reverse();
              }
            
              public getFieldCopy() {
                return [...this.field];
              }
            }`,
        },
        {
          code: `
          class NotArray {
              public reverse() {}
          }
          const notArray = new NotArray();
          // ok
          const notArrayReversed = notArray.reverse();`,
        },
        {
          code: `
            class WithGetter {
                _groups: string[];
              
                public get groups() {
                  return this._groups.slice(0);
                }
              
                public foo() {
                  // ok, using getter
                  const groups = this.groups.reverse();
                  return groups;
                }
            }`,
        },
      ],
      invalid: [
        {
          code: `
        let a = [];
        const b = a?.sort();
        `,
          errors: 1,
        },
        {
          code: `
        let a = [];
        let d;
        const b = a.reverse();
        const bb = a.sort();
        d = a.reverse();
        `,
          errors: [
            {
              message:
                'Move this array "reverse" operation to a separate statement or replace it with "toReversed".',
              line: 4,
              endLine: 4,
              column: 19,
              endColumn: 30,
              suggestions: [
                {
                  desc: 'Replace with "toReversed" method',
                  output: `
        let a = [];
        let d;
        const b = a.toReversed();
        const bb = a.sort();
        d = a.reverse();
        `,
                },
              ],
            },
            {
              message:
                'Move this array "sort" operation to a separate statement or replace it with "toSorted".',
              line: 5,
              endLine: 5,
              column: 20,
              endColumn: 28,
              suggestions: [
                {
                  desc: 'Replace with "toSorted" method',
                  output: `
        let a = [];
        let d;
        const b = a.reverse();
        const bb = a.toSorted();
        d = a.reverse();
        `,
                },
              ],
            },
            {
              message:
                'Move this array "reverse" operation to a separate statement or replace it with "toReversed".',
              line: 6,
              endLine: 6,
              column: 13,
              endColumn: 24,
              suggestions: [
                {
                  desc: 'Replace with "toReversed" method',
                  output: `
        let a = [];
        let d;
        const b = a.reverse();
        const bb = a.sort();
        d = a.toReversed();
        `,
                },
              ],
            },
          ],
        },
        {
          code: `
        let b = [];
        const a = b["sort"]()
        const a = b['sort']()
        const a = b["reverse"]()
        const a = b['reverse']()
        `,
          errors: [
            {
              message:
                'Move this array "sort" operation to a separate statement or replace it with "toSorted".',
              suggestions: [
                {
                  desc: 'Replace with "toSorted" method',
                  output: `
        let b = [];
        const a = b["toSorted"]()
        const a = b['sort']()
        const a = b["reverse"]()
        const a = b['reverse']()
        `,
                },
              ],
            },
            {
              message:
                'Move this array "sort" operation to a separate statement or replace it with "toSorted".',
              suggestions: [
                {
                  desc: 'Replace with "toSorted" method',
                  output: `
        let b = [];
        const a = b["sort"]()
        const a = b['toSorted']()
        const a = b["reverse"]()
        const a = b['reverse']()
        `,
                },
              ],
            },
            {
              message:
                'Move this array "reverse" operation to a separate statement or replace it with "toReversed".',
              suggestions: [
                {
                  desc: 'Replace with "toReversed" method',
                  output: `
        let b = [];
        const a = b["sort"]()
        const a = b['sort']()
        const a = b["toReversed"]()
        const a = b['reverse']()
        `,
                },
              ],
            },
            {
              message:
                'Move this array "reverse" operation to a separate statement or replace it with "toReversed".',
              suggestions: [
                {
                  desc: 'Replace with "toReversed" method',
                  output: `
        let b = [];
        const a = b["sort"]()
        const a = b['sort']()
        const a = b["reverse"]()
        const a = b['toReversed']()
        `,
                },
              ],
            },
          ],
        },
        {
          code: `function foo() {
            const keys = [];
            // fill keys...
            const x = keys.reverse();
          }`,
          errors: 1,
        },
        {
          code: `function reverseAndJoin() {
                  const a = [1, 2, 3];
                  const x = a.reverse().join();
              }`,
          errors: 1,
        },
        {
          code: `const a = [1, 2, 3];
            function something(a: string[]) {}
            something(a.reverse());`,
          errors: 1,
        },
        {
          code: `class Bar {
          field: string[];
        
          public method() {
            const b = this.field.reverse();
            const bb = this.field.sort();
          }
        }`,
          errors: 2,
        },
        {
          code: `function qux(a: string[][]) {
                   return a.map(b => b.reverse());
              }`,
          errors: 1,
        },
        {
          code: `function foo(a: string[][]) {
                return function(a: string[][]) {
                  let b;
                  b = a.reverse();
              }
            }`,
          errors: 1,
        },
        {
          code: `
        function foo() {
          let a = [];
          return a.length > 0 && a.reverse();
        }`,
          errors: 1,
        },
        {
          code: `
const x = ["foo", "bar", "baz"];
const y = x.sort();`,
          errors: [
            {
              messageId: 'moveMethod',
              suggestions: [
                {
                  desc: 'Replace with "toSorted" method',
                  output: `
const x = ["foo", "bar", "baz"];
const y = x.toSorted();`,
                },
              ],
            },
          ],
        },
        {
          code: `
const x = [true, false];
const y = x['reverse']();`,
          errors: [
            {
              messageId: 'moveMethod',
              suggestions: [
                {
                  desc: 'Replace with "toReversed" method',
                  output: `
const x = [true, false];
const y = x['toReversed']();`,
                },
              ],
            },
          ],
        },
        {
          code: `
const x = ["foo", "bar", "baz"];
const y = x.sort((a, b) => true);`,
          errors: [
            {
              messageId: 'moveMethod',
              suggestions: [
                {
                  desc: 'Replace with "toSorted" method',
                  output: `
const x = ["foo", "bar", "baz"];
const y = x.toSorted((a, b) => true);`,
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
