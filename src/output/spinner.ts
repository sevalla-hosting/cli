import ora from 'ora';
import type { Ora } from 'ora';

let current: Ora | null = null;

export function startSpinner(text: string): Ora {
  if (current) {
    current.stop();
  }
  current = ora(text).start();
  return current;
}

export function stopSpinner(): void {
  if (current) {
    current.stop();
    current = null;
  }
}

export function succeedSpinner(text: string): void {
  if (current) {
    current.succeed(text);
    current = null;
  }
}

export function failSpinner(text: string): void {
  if (current) {
    current.fail(text);
    current = null;
  }
}
