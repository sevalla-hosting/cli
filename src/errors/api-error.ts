export interface ApiErrorData {
  code?: string;
  message?: string;
}

export class SevallaApiError extends Error {
  public readonly status: number;
  public readonly data?: ApiErrorData;

  constructor(status: number, message: string, data?: ApiErrorData) {
    super(message);
    this.name = 'SevallaApiError';
    this.status = status;
    this.data = data;
  }

  toJSON(): Record<string, unknown> {
    return {
      error: {
        status: this.status,
        message: this.message,
        ...(this.data?.code ? { code: this.data.code } : {}),
        ...(this.data?.message ? { detail: this.data.message } : {}),
      },
    };
  }
}
