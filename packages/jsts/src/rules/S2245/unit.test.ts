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
import { DefaultParserRuleTester } from '../../../tests/tools/testers/rule-tester.js';
import { rule } from './index.js';
import { describe, it } from 'node:test';

describe('S2245', () => {
  it('S2245', () => {
    const ruleTester = new DefaultParserRuleTester();
    ruleTester.run('Using pseudorandom number generators (PRNGs) is security-sensitive', rule, {
      valid: [
        {
          code: `foo(x)`,
        },
        {
          code: `"Math.random()"`,
        },
        {
          code: `Math.foo()`,
        },
        {
          code: `Foo.random()`,
        },
      ],
      invalid: [
        {
          code: `let x = Math.random();`,
          errors: [
            {
              message: 'Make sure that using this pseudorandom number generator is safe here.',
              line: 1,
              endLine: 1,
              column: 9,
              endColumn: 22,
            },
          ],
        },
        {
          code: `foo(Math.random())`,
          errors: 1,
        },
        {
          code: `let random = Math.random; foo(random());`,
          errors: 1,
        },
      ],
    });
  });
});
