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
import { NoTypeCheckingRuleTester } from '../../../tests/tools/testers/rule-tester.js';
import { describe, it } from 'node:test';

describe('S6788', () => {
  it('S6788', () => {
    const ruleTester = new NoTypeCheckingRuleTester();

    ruleTester.run(`Decorated rule should reword the issue message`, rule, {
      valid: [
        {
          code: `type Foo = () => number;`,
        },
      ],
      invalid: [
        {
          code: `
class MyComponent extends Component {
  componentDidMount() {
    findDOMNode(this).scrollIntoView();
  }
  render() {
    return <div />
  }
}
      `,
          errors: [
            {
              message:
                "Do not use findDOMNode. It doesn't work with function components and is deprecated in StrictMode.",
            },
          ],
        },
      ],
    });
  });
});
