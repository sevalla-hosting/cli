export class SevallaCliError extends Error {
  public readonly exitCode: number;

  constructor(message: string, exitCode = 1) {
    super(message);
    this.name = 'SevallaCliError';
    this.exitCode = exitCode;
  }

  toJSON(): Record<string, unknown> {
    return {
      error: {
        message: this.message,
      },
    };
  }
}
