import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../api/client';
import { AuthService } from '../api/services/auth.service';
import { BranchService } from '../api/services/branch.service';

import {
  generateBranchPayload,
  generateBranchUpdatePayload,
} from './api-branch-data';

import {
  BranchPayload,
  BranchUpdatePayload,
} from '../api/types/branch.types';

interface ApiFixtures {
  apiClient: ApiClient;
  branchService: BranchService;
  branchPayload: BranchPayload;
  branchUpdatePayload: BranchUpdatePayload;
}

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL,
    });

    await use(new ApiClient(apiContext));

    await apiContext.dispose();
  },

  branchService: async ({ apiClient }, use) => {
    const authService = new AuthService(apiClient);

    const email = process.env.ORG_ADMIN_EMAIL as string;
    const password = process.env.ORG_ADMIN_PASSWORD as string;

    await authService.login(email, password);

    await use(new BranchService(apiClient));
  },

  branchPayload: async ({}, use) => {
    await use(generateBranchPayload());
  },

  branchUpdatePayload: async ({}, use) => {
    await use(generateBranchUpdatePayload());
  },
});

export { expect } from '@playwright/test';