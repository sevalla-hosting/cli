export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_RE = /[\x00-\x1f\x7f]/;
const SUSPICIOUS_ID_RE = /[?#%\s/\\]/;
const PATH_TRAVERSAL_RE = /\.\.\//;

export function validateId(value: string, label = 'ID'): string {
  if (!value || value.trim().length === 0) {
    throw new ValidationError(`${label} must not be empty.`);
  }
  if (CONTROL_CHAR_RE.test(value)) {
    throw new ValidationError(`${label} contains invalid control characters.`);
  }
  if (PATH_TRAVERSAL_RE.test(value)) {
    throw new ValidationError(`${label} contains path traversal sequence.`);
  }
  if (SUSPICIOUS_ID_RE.test(value)) {
    throw new ValidationError(`${label} contains invalid characters.`);
  }
  return value;
}

export function validateStringInput(value: string, label = 'input'): string {
  if (CONTROL_CHAR_RE.test(value)) {
    throw new ValidationError(`${label} contains invalid control characters.`);
  }
  return value;
}

export function validatePath(path: string): string {
  if (PATH_TRAVERSAL_RE.test(path)) {
    throw new ValidationError(`Path contains traversal sequence: ${path}`);
  }
  return path;
}
