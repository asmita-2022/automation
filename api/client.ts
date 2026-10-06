import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  private authToken: string | null = null;

  constructor(private readonly context: APIRequestContext) {}

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private get authHeaders(): Record<string, string> {
    return this.authToken
      ? {
          Authorization: `Bearer ${this.authToken}`,
        }
      : {};
  }

  get(
    path: string,
    params?: Record<string, string | number>
  ): Promise<APIResponse> {
    return this.context.get(path, {
      headers: this.authHeaders,
      params,
    });
  }

  post(path: string, data: unknown): Promise<APIResponse> {
    return this.context.post(path, {
      headers: this.authHeaders,
      data,
    });
  }

  put(path: string, data: unknown): Promise<APIResponse> {
    return this.context.put(path, {
      headers: this.authHeaders,
      data,
    });
  }

  patch(path: string, data: unknown): Promise<APIResponse> {
    return this.context.patch(path, {
      headers: this.authHeaders,
      data,
    });
  }

  delete(path: string): Promise<APIResponse> {
    return this.context.delete(path, {
      headers: this.authHeaders,
    });
  }
}