const c = require('crypto');
c.createHash();
c.createHash(unknown);
c.createHash('sha512');
c.createNotHash('sha1');
   c.createHash('sha1'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
// ^^^^^^^^^^^^
c.createHash('SHA1'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('md2'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('md4'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('md5'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('md6'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('haval128'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('hmacmd5'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('dsa'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('ripemd'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('ripemd128'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('ripemd160'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
c.createHash('hmacripemd160'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}

const foo = require('crypto');
foo.createHash('sha1'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}

const createHash = require('crypto').createHash;
   createHash('sha1'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
// ^^^^^^^^^^
import * as crypto from 'crypto';
crypto.createHash('sha1'); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}

const otpyrc = require('otpyrc');
otpyrc.createHash('sha1');

crypto.subtle.digest('SHA-512', data);
   crypto.subtle.digest('SHA-1', data); // Noncompliant {{Make sure this weak hash algorithm is not used in a sensitive context here.}}
// ^^^^^^^^^^^^^^^^^^^^
notCrypto.subtle.digest('SHA-1', data);
crypto.notSubtle.digest('SHA-1', data);
crypto.subtle.notDigest('SHA-1', data);
