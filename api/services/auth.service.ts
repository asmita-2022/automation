import { expect } from '@playwright/test';
import { ApiClient } from './../client';
import { LoginResponse } from '../types/auth.types';

export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.apiClient.post('accounts/login/', {
      email,
      password,
    });

    expect(response.status(), 'Login should succeed').toBe(200);

    const body: LoginResponse = await response.json();

    this.apiClient.setAuthToken(body.access);

    return body;
  }
}