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
import { DefaultParserRuleTester, RuleTester } from '../../../tests/tools/testers/rule-tester.js';
import { rule } from './index.js';
import { describe, it } from 'node:test';

describe('S3758', () => {
  it('S3758', () => {
    const ruleTesterTs = new RuleTester();
    const ruleTesterJs = new DefaultParserRuleTester();

    ruleTesterTs.run(
      'Values not convertible to numbers should not be used in numeric comparisons [TS]',
      rule,
      {
        valid: [
          {
            code: `42 > 41`,
          },
          {
            code: `
        const n1 = 42;
        const n2 = 0;
        n1 >= 0`,
          },
          {
            code: `
        const date = new Date();
        date > 42;
        `,
          },
          {
            code: `42 > NaN`, // FN,
          },
          {
            code: `"foo" > "hello"`,
          },
          {
            code: 'true > false',
          },
          {
            code: `
        const a = 42 === 42;
        const b = 'str';
        a < b;
        `,
          },
          {
            code: `42 > null`,
          },
          {
            code: `42 > unknown`,
          },
          {
            code: `
        const undef;
        undef > 42;`, // FN
          },
          {
            code: `"hello" <= new Object()`,
          },
          {
            code: `
        var undefinedVariable;
        var nan = undefinedVariable + 42;
        nan >= 42;`, // FN
          },
          {
            code: `
        let x = { };
        x.a >= 42;`, // FN
          },
          {
            code: `
        const a = BigInt("42");
        const b = BigInt("41");
        a > b;
        `,
          },
          {
            code: `
        const a = 42n;
        const b = 41n;
        a > b;
        `,
          },
          {
            code: `
        const a = BigInt("42");
        const b = 41n;
        a > b;
        `,
          },
        ],
        invalid: [
          {
            code: `new Object() > 0`,
            errors: [
              {
                message:
                  'Re-evaluate the data flow; this operand of a numeric comparison could be of type Object.',
                line: 1,
                endLine: 1,
                column: 1,
                endColumn: 13,
              },
            ],
          },
          {
            code: `
        const obj1 = new Object();
        const obj2 = new Object();
        obj1 < obj2;`,
            errors: 2,
          },
          {
            code: `42 > undefined`,
            errors: [
              {
                message:
                  'Re-evaluate the data flow; this operand of a numeric comparison could be of type undefined.',
              },
            ],
          },
          {
            code: `1 < function(){}`,
            errors: 1,
          },
          {
            code: `
        var array = [3,2];
        array > 42;`,
            errors: 1,
          },
          {
            code: `
        var obj = {};
        obj <= 42;`,
            errors: 1,
          },
        ],
      },
    );

    ruleTesterJs.run(
      'Values not convertible to numbers should not be used in numeric comparisons [JS]',
      rule,
      {
        valid: [{ code: `new Object() > 0` }], // no type information
        invalid: [],
      },
    );
  });
});
