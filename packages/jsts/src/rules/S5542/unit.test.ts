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

describe('S5542', () => {
  it('S5542', () => {
    const testCases = {
      valid: [
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      var iv8 = Buffer.from(crypto.randomBytes(8));
      const nonce = crypto.randomBytes(12);
      crypto.createCipheriv("AES-128-CFB", key, iv);

      crypto.createCipheriv("AES-128-CFB8", key, iv);
      crypto.createCipheriv("AES-128-CTR", key, iv);
      crypto.createCipheriv("id-aes128-GCM", key, iv);
      crypto.createCipheriv("AES-128-OCB", key, nonce, {
        authTagLength: 16
      });
      crypto.createCipheriv("AES-128-OFB", key, iv);
      crypto.createCipheriv("aes128-wrap", key, iv8); // Alias of id-aes128-wrap
      crypto.createCipheriv("id-aes128-CCM", key, nonce, {
        authTagLength: 16
      });
      crypto.createCipheriv("id-aes128-wrap", key, iv8);
      crypto.createCipheriv("AES-192-CFB", key, iv);

      crypto.createCipheriv("RC4", key, "");
      crypto.createCipheriv("RC4-40", key, "");
      crypto.createCipheriv("RC4-HMAC-MD5", key, "");
      crypto.createCipheriv("SEED-CFB", key, iv);
            `,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      let algorithm = "AES-128-CBC";
      if (x) {
        algorithm = "other";
      }
      crypto.createCipheriv(algorithm, key, iv);
            `,
        },
        {
          code: `
      const crypto = require('crypto');
      crypto.createCipheriv();
            `,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      crypto.createCipheriv();
            `,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv(42, key, iv);
            `,
        },
      ],
      invalid: [
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES-128-CBC", key, iv);
            `,
          errors: [
            {
              line: 5,
              column: 29,
              endLine: 5,
              endColumn: 42,
              message: 'Use a secure mode and padding scheme.',
            },
          ],
        },
        {
          code: `
      const crypto = require('node:crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES-128-CBC", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      const algorithm = "AES-128-CBC";
      crypto.createCipheriv(algorithm, key, iv);
            `,
          errors: [
            {
              line: 6,
              column: 29,
              endLine: 6,
              endColumn: 38,
              message: 'Use a secure mode and padding scheme.',
            },
          ],
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES-128-CBC-HMAC-SHA1", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES-128-CBC-HMAC-SHA256", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      crypto.createCipheriv("AES-128-ECB", key, "");
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES128", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("aes128", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      crypto.createCipheriv("AES-192-ECB", key, "");
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      crypto.createCipheriv("AES192", key, "");
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES-192-CBC", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("aes192", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("AES256", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("BF", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("blowfish", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("CAMELLIA128", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("CAMELLIA192", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("CAMELLIA256", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("CAST", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("DES", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("DES-EDE", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("DES-EDE3", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("DES3", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("DESX", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("RC2", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("RC2-40", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("RC2-64", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("RC2-128", key, iv);
            `,
          errors: 1,
        },
        {
          code: `
      const crypto = require('crypto');
      var key = crypto.randomBytes(16);
      var iv = Buffer.from(crypto.randomBytes(16));
      crypto.createCipheriv("SEED", key, iv);
            `,
          errors: 1,
        },
      ],
    };

    new DefaultParserRuleTester().run(
      '[JS] Encryption algorithms should be used with secure mode and padding scheme',
      rule,
      testCases,
    );
    new RuleTester().run(
      '[TS] Encryption algorithms should be used with secure mode and padding scheme',
      rule,
      testCases,
    );
  });
});
