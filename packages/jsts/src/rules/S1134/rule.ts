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
// https://sonarsource.github.io/rspec/#/rspec/S1134/javascript

import type { Rule } from 'eslint';
import { reportPatternInComment } from '../S1135/rule.js';
import { generateMeta } from '../helpers/index.js';
import * as meta from './generated-meta.js';

const fixmePattern = 'fixme';

export const rule: Rule.RuleModule = {
  meta: generateMeta(meta, {
    messages: {
      fixme: 'Take the required action to fix the issue indicated by this comment.',
    },
  }),
  create(context: Rule.RuleContext) {
    return {
      'Program:exit': () => {
        reportPatternInComment(context, fixmePattern, 'fixme');
      },
    };
  },
};
