import { test as base, expect, request } from '@playwright/test';

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
  branchService: BranchService;
  branchPayload: BranchPayload;
  branchUpdatePayload: BranchUpdatePayload;
}

export const test = base.extend<ApiFixtures>({
  branchService: async ({}, use) => {
  const apiContext = await request.newContext({
    baseURL: process.env.API_BASE_URL,
  });

  const apiClient = new ApiClient(apiContext);

    const authService = new AuthService(apiClient);

    const email = process.env.ORG_ADMIN_EMAIL as string;
    const password = process.env.ORG_ADMIN_PASSWORD as string;

    await authService.login(email, password);

    await use(new BranchService(apiClient));
    await apiContext.dispose();
  },

  branchPayload: async ({}, use) => {
    await use(generateBranchPayload());
  },

  branchUpdatePayload: async ({}, use) => {
    await use(generateBranchUpdatePayload());
  },
});

export { expect } from '@playwright/test';