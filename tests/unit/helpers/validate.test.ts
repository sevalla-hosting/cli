import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateId, validateStringInput, validatePath, ValidationError } from '../../../src/helpers/validate.ts';

describe('validateId', () => {
  it('should accept a valid ID', () => {
    assert.equal(validateId('abc-123'), 'abc-123');
    assert.equal(validateId('my_app_42'), 'my_app_42');
  });

  it('should reject empty string', () => {
    assert.throws(() => validateId(''), ValidationError);
    assert.throws(() => validateId('   '), ValidationError);
  });

  it('should reject control characters', () => {
    assert.throws(() => validateId('abc\x00def'), ValidationError);
    assert.throws(() => validateId('abc\ndef'), ValidationError);
  });

  it('should reject path traversal', () => {
    assert.throws(() => validateId('../etc/passwd'), ValidationError);
    assert.throws(() => validateId('foo/../bar'), ValidationError);
  });

  it('should reject suspicious characters', () => {
    assert.throws(() => validateId('id?query'), ValidationError);
    assert.throws(() => validateId('id#frag'), ValidationError);
    assert.throws(() => validateId('id%20enc'), ValidationError);
    assert.throws(() => validateId('id with spaces'), ValidationError);
    assert.throws(() => validateId('path/seg'), ValidationError);
    assert.throws(() => validateId('back\\slash'), ValidationError);
  });

  it('should use custom label in error message', () => {
    assert.throws(
      () => validateId('', 'Application ID'),
      (err: Error) => err.message.includes('Application ID'),
    );
  });
});

describe('validateStringInput', () => {
  it('should accept normal strings', () => {
    assert.equal(validateStringInput('hello world'), 'hello world');
  });

  it('should reject control characters', () => {
    assert.throws(() => validateStringInput('abc\x00def'), ValidationError);
    assert.throws(() => validateStringInput('abc\x1fdef'), ValidationError);
  });

  it('should allow special URL-like characters', () => {
    assert.equal(validateStringInput('https://example.com?q=1'), 'https://example.com?q=1');
  });
});

describe('validatePath', () => {
  it('should accept normal paths', () => {
    assert.equal(validatePath('/applications/123'), '/applications/123');
  });

  it('should reject path traversal', () => {
    assert.throws(() => validatePath('/applications/../etc/passwd'), ValidationError);
  });
});
